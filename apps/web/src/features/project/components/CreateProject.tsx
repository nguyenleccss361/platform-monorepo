import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LuFileSymlink, LuPlus } from 'react-icons/lu'

import { PlusIcon } from '@/components/SVGIcons'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ImportProject } from './ImportProject'
import { NewProject } from './NewProject'
import { FormDialog } from '@/components/FormDialog'

export function CreateProject() {
  const { t } = useTranslation()
  const [isDone, setIsDone] = useState(false)

  return (
    <FormDialog
      isDone={isDone}
      size="xl"
      resetData={() => setIsDone(false)}
      title={t('cloud:project_manager.add_project.title')}
      isShowCancel={false}
      body={(
        <Tabs defaultValue="new_project">
          <TabsList className="bg-white">
            <TabsTrigger
              className="data-[state=active]:border-b data-[state=active]:border-b-primary"
              value="new_project"
            >
              <div className="flex items-center gap-1">
                <LuPlus />
                <p>{t('cloud:project_manager.add_project.new_project')}</p>
              </div>
            </TabsTrigger>
            <TabsTrigger
              className="data-[state=active]:border-b data-[state=active]:border-b-primary"
              value="import_project"
            >
              <div className="flex items-center gap-1">
                <LuFileSymlink />
                <p>{t('cloud:project_manager.add_project.import')}</p>
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="new_project">
            <NewProject close={setIsDone} />
          </TabsContent>
          <TabsContent value="import_project">
            <ImportProject close={setIsDone} />
          </TabsContent>
        </Tabs>
      )}
      triggerButton={(
        <Button
          className="h-[38px] w-28 rounded-md bg-primary text-white"
          variant="trans"
          size="square"
          startIcon={<PlusIcon width={12} height={12} viewBox="0 0 16 16" />}
        >
          {t('cloud:project_manager.create')}
        </Button>
      )}
      confirmButton={<></>}
    />
  )
}
