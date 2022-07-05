export interface StatusPageDBDocumentShared {
  pk: string;
  sk: string;
  uuid: string; // needed for GSI for public links
}

export type StatusPageDBDocumentType = "PAGE" | "INCIDENT" | "SUBSCRIBER";

export interface StatusPage extends StatusPageDBDocumentShared {
  project_id: string;
  page_id: string;
  owner_id: string;
  type: StatusPageDBDocumentType;

  monitor_groups: MonitorGroup[];

  access: {
    public: boolean;
    encrypted_password?: string;
  };

  styles: {
    external_link?: string;
    primary_color: string;
    secondary_color: string;
    up_color: string;
    down_color: string;
    text_color: string;
    banner_img?: string;
    logo: {
      type: "text" | "image";
      data: string;
    };
    favicon_img?: string;
  };
}

export interface MonitorGroup {
  name: string; // unique
  monitors: MonitorOption[];
}

export interface MonitorOption {
  monitor_id: string;
  display_name: string;
  description?: string;
  show_checks: boolean;
  show_region: boolean;
}

export interface StatusPageSubscriber extends StatusPageDBDocumentShared {
  recipient: string;
  type: "EMAIL" | "SLACK" | "PUSH_NOTIFICATION";
  status: "ACTIVE" | "INACTIVE"; // so we know whether or not to send messages
}

export interface StatusPageIncident extends StatusPageDBDocumentShared {}

const DELIMITER = "#";

export const createStatusPageDbDocumentCompoundPk = (
  type: StatusPageDBDocumentType,
  id: string
) => type + DELIMITER + id;

export const getIdFromCompoundPk = (compoundPk: string) =>
  compoundPk.split(DELIMITER)[1];
