export type PositionStatus = "Abierto" | "Contratado" | "Cerrado" | "Borrador";

export type Position = {
  id: number;
  title: string;
  manager: string;
  deadline: string;
  status: PositionStatus;
};

type PositionApiPayload = Position[] | { positions: Position[] };

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3010";

const requestJson = async <T>(paths: string[]): Promise<T> => {
  let lastError: Error | null = null;

  for (const path of paths) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        lastError = new Error(`No se pudo cargar posiciones (status ${response.status})`);
        continue;
      }

      return (await response.json()) as T;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("Error de red al cargar posiciones");
    }
  }

  throw lastError ?? new Error("No endpoint available for positions request");
};

export const getPositions = async (): Promise<Position[]> => {
  const payload = await requestJson<PositionApiPayload>(["/positions", "/position"]);

  if (Array.isArray(payload)) {
    return payload;
  }

  return payload.positions;
};
