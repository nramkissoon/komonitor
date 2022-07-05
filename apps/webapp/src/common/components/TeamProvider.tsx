import React from "react";

export interface TeamContextType {
  team?: string;
  setTeam: (team: string | undefined) => void;
}

export const TeamContext = React.createContext({} as TeamContextType);

// React hook that reads from TeamProvider context
export const useTeam = () => {
  const context = React.useContext(TeamContext);
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
};

export const TeamProvider = ({ children }: { children?: React.ReactNode }) => {
  const [team, rawSetTeam] = React.useState<string | undefined>(
    localStorage.getItem("team") ?? undefined
  );

  const setTeam = React.useCallback((value: string | undefined) => {
    rawSetTeam(value);
    if (value === undefined) {
      localStorage.removeItem("team");
    } else {
      localStorage.setItem("team", value);
    }
  }, []);

  const context = React.useMemo(
    () => ({
      team: team,
      setTeam: setTeam,
    }),
    [team, setTeam]
  );

  return (
    <TeamContext.Provider value={context}>{children}</TeamContext.Provider>
  );
};
