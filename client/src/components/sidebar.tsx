import { motion } from "framer-motion";
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  Settings, 
  Trophy, 
  Award, 
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Save,
  FileText,
  Search,
  Users,
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { scrollToSection } from "@/lib/utils";
import { Link, useLocation } from "wouter";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navigationItems = [
  { id: "personal", label: "Personal Info", icon: User, color: "text-blue-600" },
  { id: "education", label: "Education", icon: GraduationCap, color: "text-indigo-600" },
  { id: "experience", label: "Experience", icon: Briefcase, color: "text-emerald-600" },
  { id: "projects", label: "Projects", icon: Code, color: "text-purple-600" },
  { id: "skills", label: "Skills", icon: Settings, color: "text-amber-600" },
  { id: "awards", label: "Awards", icon: Trophy, color: "text-yellow-600" },
  { id: "certifications", label: "Certifications", icon: Award, color: "text-teal-600" },
  { id: "cocurricular", label: "Co-Curricular", icon: Users, color: "text-rose-600" },
  { id: "coding", label: "Coding Profiles", icon: Terminal, color: "text-green-600" },
  { id: "additional", label: "Additional Info", icon: PlusCircle, color: "text-slate-600" },
];

const toolItems = [
  { id: "resume-creator", label: "Resume Creator", icon: FileText, color: "text-blue-600", path: "/resume-creator" },
  { id: "resume-screener", label: "Resume Screener", icon: Search, color: "text-purple-600", path: "/resume-screener" },
];

export default function Sidebar({ 
  activeSection, 
  onSectionChange, 
  collapsed, 
  onToggleCollapse 
}: SidebarProps) {
  const [location] = useLocation();
  
  const handleNavClick = (sectionId: string) => {
    onSectionChange(sectionId);
    scrollToSection(sectionId);
  };

  return (
    <motion.div 
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-lg z-50 transition-all duration-300 flex flex-col ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border flex-shrink-0">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <User className="text-primary-foreground text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Profile Dashboard</h2>
                <p className="text-sm text-gray-600">Manage your profile</p>
              </div>
            </motion.div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-2 hover:bg-sidebar-accent"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      {/* Resume Tools Section - Moved to Top */}
      <div className={`${collapsed ? 'px-2' : 'px-4'} py-4 border-b-2 border-purple-200 bg-gradient-to-r from-purple-50 to-blue-50 flex-shrink-0`}>
        {!collapsed && (
          <h3 className="text-sm font-bold text-purple-700 mb-3 uppercase tracking-wide">
            🎯 Resume Tools
          </h3>
        )}
        <div className="space-y-2">
          {toolItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path;
            return (
              <Link key={item.id} href={item.path}>
                <motion.button
                  className={`w-full flex items-center p-3 rounded-xl font-semibold transition-all duration-200 shadow-sm ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-purple-100 hover:text-purple-700 hover:shadow-md border border-purple-200'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className={`${collapsed ? 'mx-auto' : 'mr-3'} ${isActive ? 'text-white' : item.color} transition-colors`} size={18} />
                  {!collapsed && (
                    <span className="font-semibold transition-colors text-sm">{item.label}</span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div
                      className="ml-auto w-2 h-2 bg-white rounded-full shadow-sm"
                      layoutId="toolActiveIndicator"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.button>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Navigation - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <nav className="p-4">
          <motion.ul 
            className="space-y-2 stagger-animation"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.3,
                },
              },
            }}
          >
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <motion.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <button
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 ${
                      isActive ? 'bg-blue-100 text-blue-900 shadow-sm' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className={`${collapsed ? 'mx-auto' : 'mr-3'} ${item.color} transition-colors`} size={20} />
                    {!collapsed && (
                      <span className="font-medium transition-colors">{item.label}</span>
                    )}
                    {isActive && !collapsed && (
                      <motion.div
                        className="ml-auto w-2 h-2 bg-primary rounded-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                </motion.li>
              );
            })}
          </motion.ul>
        </nav>
      </div>

      {/* Save Button - Fixed at Bottom */}
      <div className={`p-4 border-t border-gray-200 flex-shrink-0`}>
        <Button 
          className={`w-full ${collapsed ? 'p-3' : ''}`}
          title={collapsed ? "Save Profile" : undefined}
        >
          <Save className={`${collapsed ? 'mx-auto' : 'mr-2'} text-primary-foreground`} size={16} />
          {!collapsed && "Save Profile"}
        </Button>
      </div>
    </motion.div>
  );
}