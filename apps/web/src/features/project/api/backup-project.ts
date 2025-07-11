import { axios } from '@/lib/axios'
import type { Project } from '@/routes/_projectLayout.project'


export const backupProject = ({
  projectId,
}: {
  projectId: string | undefined
}): Promise<Project> => {
  return axios.get(`/api/projects/backup/${projectId}`)
}
