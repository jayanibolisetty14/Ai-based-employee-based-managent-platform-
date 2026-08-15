const fs = require('fs');
let profile = fs.readFileSync('src/pages/Profile.tsx', 'utf8');

if (!profile.includes('useAuth')) {
  profile = profile.replace("import { useWellness } from '@/context/WellnessContext';", "import { useWellness } from '@/context/WellnessContext';\nimport { useAuth } from '@/context/AuthContext';\nimport { useNavigate } from 'react-router-dom';");
}

if (!profile.includes('const { logout } = useAuth();')) {
  profile = profile.replace("export default function Profile() {", "export default function Profile() {\n  const { logout } = useAuth();\n  const navigate = useNavigate();\n\n  const handleLogout = () => {\n    logout();\n    navigate('/login', { replace: true });\n  };");
}

if (!profile.includes('handleLogout')) {
  const logoutButtonHtml = `
          <GlassCard className="bg-red-500/10 border-red-500/20 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black uppercase tracking-widest text-red-400">Account Session</h4>
                <p className="text-[10px] text-red-400/70 font-bold mt-1">Disconnect your current session.</p>
              </div>
              <button onClick={handleLogout} className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors">
                Sign Out
              </button>
            </div>
          </GlassCard>
`;
  profile = profile.replace("</GlassCard>\n        </div>\n      </div>", "</GlassCard>\n" + logoutButtonHtml + "        </div>\n      </div>");
}

fs.writeFileSync('src/pages/Profile.tsx', profile, 'utf8');
