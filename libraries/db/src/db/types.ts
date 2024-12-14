import { users, messages, rooms } from './schema';

export type User = typeof users.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Room = typeof rooms.$inferSelect;
