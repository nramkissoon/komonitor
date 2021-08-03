import { AB, AbDatabaseClientFacade, ExperimentId } from "./ab";

export class ABClient extends AB {
  abDatabaseClientFacade: AbDatabaseClientFacade;

  constructor(abDatabaseClientFacade: AbDatabaseClientFacade) {
    super();
    this.abDatabaseClientFacade = abDatabaseClientFacade;
  }

  updateExperimentTreatmentAllocations = async (
    id: ExperimentId,
    controlAllocation: number,
    experimentalAllocation: number
  ) => {
    if (controlAllocation + experimentalAllocation != 1) {
      throw new Error();
    }

    const result = await this.abDatabaseClientFacade.updateAllocation(
      id,
      controlAllocation,
      experimentalAllocation
    );

    return result;
  };
}
