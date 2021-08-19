export type CheckEventIdNotProcessed = (eventId: string) => Promise<boolean>;

export type AddEventIdToDb = (eventId: string) => Promise<void>;
