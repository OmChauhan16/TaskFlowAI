// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getProjects, deleteProject } from '../../services/projectService';
// import ProjectCard from './ProjectCard';
// import CreateProjectModal from './CreateProjectModal';
// import toast from 'react-hot-toast';
// import { Plus } from 'lucide-react';
// import Header from '../Header';

// const ProjectList = () => {
//     const navigate = useNavigate();
//     const [projects, setProjects] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [showCreateModal, setShowCreateModal] = useState(false);

//     useEffect(() => {
//         fetchProjects();
//     }, []);

//     const fetchProjects = async () => {
//         try {
//             setLoading(true);
//             const data = await getProjects();
//             setProjects(data.projects);
//         } catch (error) {
//             toast.error('Failed to fetch projects');
//             console.error(error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleProjectCreated = (newProject) => {
//         setProjects([newProject, ...projects]);
//         setShowCreateModal(false);
//         toast.success('Project created successfully!');
//     };

//     const handleDeleteProject = async (projectId) => {
//         if (!window.confirm('Are you sure you want to delete this project?')) {
//             return;
//         }

//         try {
//             await deleteProject(projectId);
//             setProjects(projects.filter(p => p._id !== projectId));
//             toast.success('Project deleted');
//         } catch (error) {
//             toast.error('Failed to delete project');
//             console.error(error);
//         }
//     };

//     const handleProjectClick = (projectId) => {
//         navigate(`/projects/${projectId}`);
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <Header />

//             <div className="max-w-7xl mx-auto px-4 py-8">
//                 <div className="flex items-center justify-between mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
//                         <p className="text-gray-600 mt-2">{projects.length} total projects</p>
//                     </div>
//                     <button
//                         onClick={() => setShowCreateModal(true)}
//                         className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                     >
//                         <Plus className="w-5 h-5" />
//                         New Project
//                     </button>
//                 </div>

//                 {projects.length === 0 ? (
//                     <div className="text-center py-12">
//                         <div className="text-6xl mb-4">📁</div>
//                         <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects yet</h3>
//                         <p className="text-gray-500 mb-4">Create your first project to get started</p>
//                         <button
//                             onClick={() => setShowCreateModal(true)}
//                             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//                         >
//                             Create Project
//                         </button>
//                     </div>
//                 ) : (
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {projects.map((project) => (
//                             <ProjectCard
//                                 key={project._id}
//                                 project={project}
//                                 onClick={() => handleProjectClick(project._id)}
//                                 onDelete={() => handleDeleteProject(project._id)}
//                             />
//                         ))}
//                     </div>
//                 )}

//                 {showCreateModal && (
//                     <CreateProjectModal
//                         onClose={() => setShowCreateModal(false)}
//                         onProjectCreated={handleProjectCreated}
//                     />
//                 )}
//             </div>
//         </div>
//     );
// };

// export default ProjectList;



import { useState, useEffect } from 'react';
import { getProjects, deleteProject } from '../../services/projectService';
import ProjectCard from './ProjectCard';
import CreateProjectModal from './CreateProjectModal';
import ProjectDetailModal from './ProjectDetailModal';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import Header from '../Header';

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const data = await getProjects();
            setProjects(data.projects);
        } catch (error) {
            toast.error('Failed to fetch projects');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleProjectCreated = (newProject) => {
        setProjects([newProject, ...projects]);
        setShowCreateModal(false);
        toast.success('Project created successfully!');
    };

    const handleDeleteProject = async (projectId) => {
        if (!window.confirm('Are you sure you want to delete this project?')) {
            return;
        }
        try {
            await deleteProject(projectId);
            setProjects(projects.filter(p => p._id !== projectId));
            toast.success('Project deleted');
        } catch (error) {
            toast.error('Failed to delete project');
            console.error(error);
        }
    };

    const handleProjectClick = (projectId) => {
        setSelectedProjectId(projectId);
    };

    const handleProjectUpdated = (updatedProject) => {
        setProjects(projects.map(p =>
            p._id === updatedProject._id ? updatedProject : p
        ));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div>
            <Header />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
                        <p className="text-gray-600 mt-2">{projects.length} total projects</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <Plus className="w-5 h-5" />
                        New Project
                    </button>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📁</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No projects yet</h3>
                        <p className="text-gray-500 mb-4">Create your first project to get started</p>
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            Create Project
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <ProjectCard
                                key={project._id}
                                project={project}
                                onClick={() => handleProjectClick(project._id)}
                                onDelete={() => handleDeleteProject(project._id)}
                            />
                        ))}
                    </div>
                )}

                {showCreateModal && (
                    <CreateProjectModal
                        onClose={() => setShowCreateModal(false)}
                        onProjectCreated={handleProjectCreated}
                    />
                )}

                {selectedProjectId && (
                    <ProjectDetailModal
                        projectId={selectedProjectId}
                        onClose={() => setSelectedProjectId(null)}
                        onProjectUpdated={handleProjectUpdated}
                    />
                )}
            </div>
        </div>
    );
};

export default ProjectList;