import { redirect } from "next/navigation";

/**
 * This zone only serves /admin/*. Hitting the zone root directly (e.g. during
 * local development on this app's own port) sends you to its dashboard rather
 * than a bare 404. In production the shell owns "/" and this is never reached.
 */
export default function ZoneRoot() {
  redirect("/admin");
}
