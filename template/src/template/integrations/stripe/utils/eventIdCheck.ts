export const eventIdNotProcessed = async (
  eventId: string
): Promise<boolean> => {
  try {
    // TODO check if eventId in DB
    // TODO if in DB return false else return true
    return true;
  } catch (error) {
    // TODO log error
    // throw error up to webhook in order to return 500 status code so Stripe can resend event.
    throw error;
  }
};

export const addEventIdToDB = async (eventId: string) => {
  try {
    // TODO add id to db
  } catch (error) {
    // TODO log error
  }
};
