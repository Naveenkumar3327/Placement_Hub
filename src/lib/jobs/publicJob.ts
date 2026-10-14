const publicJobFields = [
  "_id",
  "title",
  "type",
  "description",
  "responsibilities",
  "requirements",
  "skills",
  "experienceLevel",
  "minExperienceYears",
  "salaryMin",
  "salaryMax",
  "salaryPeriod",
  "currency",
  "location",
  "workMode",
  "deadline",
  "openings",
  "department",
  "educationRequirements",
  "eligibilityCgpa",
  "status",
  "approvalStatus",
  "applicantsCount",
  "createdAt",
  "updatedAt",
] as const;

export function toAnonymousJob(job: Record<string, any>) {
  const publicFields = Object.fromEntries(
    publicJobFields
      .filter((field) => job[field] !== undefined)
      .map((field) => [field, job[field]])
  );

  return {
    ...publicFields,
    companyName: null,
    companyLogo: null,
    employerHidden: true,
  };
}
