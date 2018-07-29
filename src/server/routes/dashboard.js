const apiClient = require('../../gateway/codeship');
const router = require('express').Router();

async function appendBuildsToProjects(orgId, project) {
  project.builds = (await apiClient.getBuilds(orgId, project.uuid)).builds;
  return project;
}
router.get('/', async (req, res) => {

  // Authenticate the user
  const authorization = await apiClient.authenticate();

  // Use their first organization UUID
  const orgId = authorization.organizations[0].uuid;

  // Get the organization's projects
  let projects = (await apiClient.getProjects(orgId)).projects;

  // Embed the latest builds into each project
  projects = await Promise.all(projects.map((project) => {
    return appendBuildsToProjects(orgId, project);
  }));

  // Render the getProjects view with projects
  res.render('index', { projects });
});


// async function getProjects(req, res) {
// }

module.exports = router;
