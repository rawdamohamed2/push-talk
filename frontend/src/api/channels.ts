import { request } from "./http.ts";
import type { Channel, newChannel, User } from "@/types";

export const getChannels = () =>
  request<Channel[]>("/channels", { method: "GET" });

export const createChannel = (data: newChannel) =>
  request<Channel>("/channels", { method: "POST", json: data });

export const joinChannel = (channel_id: number) =>
  request<Channel>(`/channels/${channel_id}/join`, { method: "POST" });

export const getChannelMembers = (channel_id: number) =>
  request<User[]>(`/channels/${channel_id}/members`, { method: "GET" });

export const getChannel = (channel_id: number) =>
  request<Channel>(`/channels/${channel_id}`, { method: "GET" });
