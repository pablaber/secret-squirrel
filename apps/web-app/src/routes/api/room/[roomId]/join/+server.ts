import crypto from 'node:crypto';
import { db, schema } from '@squirrel/db';
import { createCryptoUtils } from '$lib/utils';
import { eq } from 'drizzle-orm';

const { rooms } = schema;
const cryptoUtils = createCryptoUtils(crypto.webcrypto.subtle as SubtleCrypto);

export async function POST({ request, params }) {
	const { roomId } = params;
	const { publicKey: guestPublicKey } = await request.json();

	if (!roomId || !guestPublicKey) {
		return Response.json(
			{
				error: 'Room ID and public key are required'
			},
			{ status: 400 }
		);
	}

	const guestFingerprint = await cryptoUtils.calculateFingerprint(guestPublicKey);

	const existingRoom = await db.query.rooms.findFirst({
		where: (rooms, { eq }) =>eq(rooms.id, roomId)
	});

	if (!existingRoom) {
		return Response.json(
			{
				error: 'Room not found'
			},
			{ status: 404 }
		);
	}

	if (existingRoom.guestPublicKey) {
		return Response.json(
			{
				error: 'Room already has a guest'
			},
			{ status: 400 }
		);
	}

	const [updatedRoom] = await db
		.update(rooms)
		.set({
			guestPublicKey,
			guestFingerprint
		})
		.where(eq(rooms.id, roomId))
		.returning();

	return Response.json({
		room: updatedRoom
	});
}
