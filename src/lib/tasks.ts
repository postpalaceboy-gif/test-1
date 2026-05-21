export const SPECIAL_DAYS = [
  "International Workers' Day",
  "World Press Freedom Day",
  "World Red Cross Day",
  "International Nurses Day",
  "International Day of Families",
  "World No Tobacco Day",
  "Global Day of Parents",
  "World Environment Day",
  "World Oceans Day",
  "World Blood Donor Day",
  "International Day of Yoga",
  "World Population Day",
  "Nelson Mandela International Day",
  "International Day of Friendship",
  "International Day of the World's Indigenous Peoples",
  "International Youth Day",
  "World Humanitarian Day",
  "International Day of Charity",
  "International Literacy Day",
  "International Day of Democracy",
  "International Day of Peace",
  "World Tourism Day",
  "International Day of Older Persons",
  "World Teachers' Day",
  "World Mental Health Day",
  "World Food Day",
  "United Nations Day",
  "Halloween",
  "World Science Day for Peace and Development",
  "World Diabetes Day",
  "International Day for Tolerance",
  "Universal Children's Day",
  "World AIDS Day",
  "International Day of Persons with Disabilities",
  "International Volunteer Day",
  "Human Rights Day",
  "Christmas Day",
] as const;

export const POYA_DAYS = [
  "Duruthu Full Moon Poya Day",
  "Navam Full Moon Poya Day",
  "Medin Full Moon Poya Day",
  "Bak Full Moon Poya Day",
  "Vesak Full Moon Poya Day",
  "Adhi Poson Full Moon Poya Day",
  "Poson Full Moon Poya Day",
  "Esala Full Moon Poya Day",
  "Nikini Full Moon Poya Day",
  "Binara Full Moon Poya Day",
  "Vap Full Moon Poya Day",
  "Ill Full Moon Poya Day",
  "Unduvap Full Moon Poya Day",
] as const;

export type TaskCategory = "special" | "poya";
export type ContentKind = "image" | "text";

export const FOLDERS: Record<TaskCategory, Record<ContentKind, string>> = {
  poya: {
    text: "1lUO_esE-ugQs-y_mWq3dAsELh8Oj5HHw",
    image: "1J_ZCAaiGZoeY0t9Up8Xxs5x4u3yuyWpC",
  },
  special: {
    text: "1WcWkPrCHpkUA22sVPrXEk-QvTr8vcDLo",
    image: "1hxFd4kR630UF2SpS1k4nDbZit1U6V0bG",
  },
};

export function getTaskList(category: TaskCategory): readonly string[] {
  return category === "poya" ? POYA_DAYS : SPECIAL_DAYS;
}