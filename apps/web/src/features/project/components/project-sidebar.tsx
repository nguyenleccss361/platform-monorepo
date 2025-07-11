import logo from '@/assets/images/logo.svg'

function ProjectSidebar() {
  return (
    <div className="hidden w-64 flex-col lg:flex lg:shrink-0">
      <nav
        className="grow space-y-1 overflow-y-auto bg-white  "
        aria-label="Sidebar"
      >
<img src={logo} alt="logo" className="h-10 cursor-pointer px-6" />
        {/* <ProjectSideNavigation /> */}
      </nav>
    </div>
  )
}

export default ProjectSidebar
