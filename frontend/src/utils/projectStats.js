export function getProjectStats(
  projects
) {
  const totalProjects =
    projects.length;

  const verifiedProjects =
    projects.filter(
      (project) =>
        project.verified
    ).length;

  const allTechnologies =
    projects.flatMap(
      (project) =>
        project.technologies ||
        []
    );

  const uniqueTechnologies =
    new Set(allTechnologies)
      .size;

  return {
    totalProjects,
    verifiedProjects,
    uniqueTechnologies,
  };
}