// 


// import { MoreVertical, Users, CheckCircle2 } from 'lucide-react';
// import { useState } from 'react';

// const ProjectCard = ({ project, onClick, onDelete }) => {
//     const [showMenu, setShowMenu] = useState(false);

//     // Calculate actual member and task counts from project data
//     const memberCount = project.members?.length || 0;
//     const taskCount = project.tasks?.length || 0;

//     // If tasks aren't populated in the project object, try taskCount field
//     const actualTaskCount = taskCount > 0 ? taskCount : (project.taskCount || 0);

//     // Calculate completed tasks
//     const completedTasks = project.tasks?.filter(task =>
//         task.status === 'done' || task.status === 'completed'
//     ).length || 0;

//     const handleMenuClick = (e) => {
//         e.stopPropagation();
//         setShowMenu(!showMenu);
//     };

//     const handleDelete = (e) => {
//         e.stopPropagation();
//         setShowMenu(false);
//         onDelete();
//     };

//     return (
//         <div
//             onClick={onClick}
//             className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 relative group"
//         >
//             {/* Three Dots Menu */}
//             <div className="absolute top-4 right-4">
//                 <button
//                     onClick={handleMenuClick}
//                     className="p-2 hover:bg-gray-100 rounded-lg transition opacity-0 group-hover:opacity-100"
//                 >
//                     <MoreVertical className="w-5 h-5 text-gray-600" />
//                 </button>

//                 {showMenu && (
//                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-10">
//                         <button
//                             onClick={handleDelete}
//                             className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
//                         >
//                             Delete Project
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* Project Icon */}
//             <div
//                 className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-md"
//                 style={{ backgroundColor: project.color || '#3B82F6' }}
//             >
//                 {project.name.charAt(0).toUpperCase()}
//             </div>

//             {/* Project Info */}
//             <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
//                 {project.name}
//             </h3>
//             <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
//                 {project.description || 'No description'}
//             </p>

//             {/* Stats */}
//             <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                 <div className="flex items-center gap-2 text-gray-600">
//                     <Users className="w-4 h-4" />
//                     <span className="text-sm font-medium">
//                         {memberCount} {memberCount === 1 ? 'member' : 'members'}
//                     </span>
//                 </div>
//                 <div className="flex items-center gap-2 text-gray-600">
//                     <CheckCircle2 className="w-4 h-4" />
//                     <span className="text-sm font-medium">
//                         {actualTaskCount} {actualTaskCount === 1 ? 'task' : 'tasks'}
//                     </span>
//                 </div>
//             </div>

//             {/* Progress Bar (if tasks exist) */}
//             {actualTaskCount > 0 && (
//                 <div className="mt-4">
//                     <div className="flex justify-between text-xs text-gray-500 mb-1">
//                         <span>Progress</span>
//                         <span>{Math.round((completedTasks / actualTaskCount) * 100)}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                         <div
//                             className="h-2 rounded-full transition-all duration-300"
//                             style={{
//                                 width: `${(completedTasks / actualTaskCount) * 100}%`,
//                                 backgroundColor: project.color || '#3B82F6'
//                             }}
//                         ></div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProjectCard;


import { MoreVertical, Users, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

const ProjectCard = ({ project, onClick, onDelete }) => {
    const [showMenu, setShowMenu] = useState(false);

    // Your backend returns members as: [{ user: {...}, role: 'owner' }]
    // So we need to count the members array length, not members.user
    const memberCount = project.members?.length || project.memberCount || 0;

    // Backend now sends taskCount directly
    const taskCount = project.taskCount || 0;

    const handleMenuClick = (e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setShowMenu(false);
        onDelete();
    };

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-gray-200 relative group"
        >
            {/* Three Dots Menu */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={handleMenuClick}
                    className="p-2 hover:bg-gray-100 rounded-lg transition opacity-0 group-hover:opacity-100"
                >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {showMenu && (
                    <>
                        {/* Backdrop to close menu */}
                        <div
                            className="fixed inset-0 z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowMenu(false);
                            }}
                        ></div>

                        {/* Menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-20">
                            <button
                                onClick={handleDelete}
                                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 transition"
                            >
                                Delete Project
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Project Icon */}
            <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-md"
                style={{ backgroundColor: project.color || '#3B82F6' }}
            >
                {project.name.charAt(0).toUpperCase()}
            </div>

            {/* Project Info */}
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                {project.name}
            </h3>
            <p className="text-gray-600 text-sm mb-6 line-clamp-2 min-h-[40px]">
                {project.description || 'No description'}
            </p>

            {/* Stats */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {memberCount} {memberCount === 1 ? 'member' : 'members'}
                    </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-sm font-medium">
                        {taskCount} {taskCount === 1 ? 'task' : 'tasks'}
                    </span>
                </div>
            </div>

            {/* Optional: Show member avatars */}
            {project.members && project.members.length > 0 && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                    <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((member, idx) => (
                            <img
                                key={idx}
                                src={member.user?.avatar || `https://ui-avatars.com/api/?name=${member.user?.name || 'User'}&background=random`}
                                alt={member.user?.name || 'Member'}
                                className="w-8 h-8 rounded-full border-2 border-white"
                                title={member.user?.name}
                            />
                        ))}
                        {project.members.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                                +{project.members.length - 3}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectCard;