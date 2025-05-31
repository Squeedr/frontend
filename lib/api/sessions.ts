import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337/api";

export interface CreateSessionData {
  title: string;
  workspace: string;
  expertName: string;
  expertId: string;
  clientName: string;
  clientId: string;
  date: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
  notes?: string;
  recordingUrl?: string;
}

export const createSession = async (sessionData: CreateSessionData, jwt: string) => {
  const response = await axios.post(
    `${API_URL}/sessions`,
    { data: sessionData },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const getSessions = async (jwt: string) => {
  const response = await axios.get(
    `${API_URL}/sessions`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return response.data;
};

export const updateSession = async (sessionId: string, sessionData: Partial<CreateSessionData>, jwt: string) => {
  const response = await axios.put(
    `${API_URL}/sessions/${sessionId}`,
    { data: sessionData },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteSession = async (sessionId: string, jwt: string) => {
  const response = await axios.delete(
    `${API_URL}/sessions/${sessionId}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  return response.data;
}; 