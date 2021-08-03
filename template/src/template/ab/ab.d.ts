/**
 * byUserId - a user will be assigned a treatment that is saved in a DB and used to determine treatment
 *
 * random - random assignment of treatment based on given allocation amounts, one user can be assigned a different treatment on multiple occasions
 */
export enum AllocationType {
  BY_USER_ID = "byUserId",
  RANDOM = "random",
}

export type ExperimentId = string;

export type ExperimentAllocationChangeRecord = {
  changeDate: string;
  controlAllocation: number;
  experimentalAllocation: number;
};

export interface Experiment {
  id: ExperimentId;
  creationDate: string;
  allocationType: AllocationType;
  controlAllocation: number;
  experimentalAllocation: number;
  changeRecords: ExperimentAllocationChangeRecord[];
}

export type CreateExperimentResult = { experimentId: ExperimentId };

export type GetExperimentResult = Experiment;

export type UpdateExperimentTreatmentAllocationsResult = {
  experimentId: ExperimentId;
};

export type DeleteExperimentResult = {
  experimentId: ExperimentId;
};

export type CreateUserTreatmentOverrideResult = {
  userId: string;
  treatment: AllocationType;
};

/**
 * Facade class for exposing database operations to the AB class.
 * Implementation for DynamoDB is included. Client should write another implementation for their choice of database.
 */
export abstract class AbDatabaseClientFacade {
  constructor(dbClientConfig: Object);

  getExperiment: (id: ExperimentId) => GetExperimentResult;

  createExperiment: (
    id: ExperimentId,
    allocationType: AllocationType
  ) => CreateExperimentResult;

  deleteExperiment: (id: ExperimentId) => DeleteExperimentResult;

  updateAllocation: (
    id: ExperimentId,
    controlAllocation: number,
    experimentalAllocation: number
  ) => UpdateExperimentTreatmentAllocationsResult;

  createOverride: (
    experimentId: ExperimentId,
    userId: string
  ) => CreateUserTreatmentOverrideResult;
}

/**
 * Main entry point for AB testing functionality.
 */
export abstract class AB {
  /**
   * Database facade that exposes database operations to class.
   */
  abDatabaseClientFacade: AbDatabaseClientFacade;

  /**
   * Creates an experiment and writes it to the Experiment Database.
   */
  createExperiment: (
    id: ExperimentId,
    allocationType: AllocationType
  ) => CreateExperimentResult;

  /**
   * Gets an Experiment from the Experiment Database.
   */
  getExperiment: (id: ExperimentId) => GetExperimentResult;

  /**
   * Updates an experiments treatment allocations. If experiment allocates treatment by userId,
   * userId's that have been assigned a treatment are reassigned to match the new allocations.
   */
  updateExperimentTreatmentAllocations: (
    id: ExperimentId,
    controlAllocation: number,
    experimentalAllocation: number
  ) => Promise<UpdateExperimentTreatmentAllocationsResult>;

  deleteExperiment: (experimentId: ExperimentId) => DeleteExperimentResult;

  getIsControlTreatment: (
    experimentId: ExperimentId,
    userId?: string
  ) => boolean;

  getIsExperimentalTreatment: (
    experimentId: ExperimentId,
    userId?: string
  ) => boolean;

  /**
   * Overrides the assigned treatment to a specific user if it exists. Assigns treatment if no current treatment exists.
   * Updates flag in database that the treatment for userId is an override and should not be changed when allocations are reassigned.
   */
  createUserTreatmentOverride: (
    experimentId: ExperimentId,
    userId: string
  ) => CreateUserTreatmentOverrideResult;

  /**
   * Helper method for assigning treatments to users.
   */
  private assignUserTreatment: (
    experiment: Experiment,
    userId: string
  ) => AllocationType;
}
