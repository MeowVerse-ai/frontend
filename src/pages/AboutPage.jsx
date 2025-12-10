import Navbar from '../components/layout/Navbar';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />
      
      <div className="pt-24 pb-12">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="relative px-4">
          <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-5xl sm:text-6xl font-black mb-4 leading-tight">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Meet Meowgineers
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                The finest felines driving innovation in pet tech
              </p>
            </div>

            {/* Team Photo */}
            <div className="max-w-xl mx-auto mb-4 sm:mb-8">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition duration-500"></div>
                <div className="relative overflow-hidden rounded-3xl border-4 border-purple-500/30">
                  <img 
                    src="/team.png" 
                    alt="Founding Team"
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>

            {/* Team Members */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-4 sm:mb-8">
              {[
                {
                  name: '米果(MiGuo)',
                  role: 'Chief Technology Officer',
                  badge: 'CTO',
                  desc: 'Codes by day, naps on the keyboard by night, turning purrs into innovation.',
                  gradient: 'from-blue-500 to-cyan-500',
                  skills: ['AI/ML', 'Architecture']
                },
                {
                  name: '豆包(DouBao)',
                  role: 'Chief Product Officer',
                  badge: 'CPO',
                  desc: 'Believes every click should feel as smooth as a cat\'s purr - intuitive, cozy, full of joy.',
                  gradient: 'from-pink-500 to-rose-500',
                  skills: ['UX Design', 'Product']
                },
                {
                  name: '丘丘(QiuQiu)',
                  role: 'Chief Executive Officer',
                  badge: 'CEO',
                  desc: 'Visionary with nine lives of wisdom. Loving father to MiGuo and DouBao.',
                  gradient: 'from-amber-500 to-orange-500',
                  skills: ['Strategy', 'Leadership']
                },
              ].map((member, idx) => (
                <div key={idx} className="group relative">
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${member.gradient} rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-500`}></div>
                  <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-purple-500/20 h-full">
                    <div className={`inline-block px-4 py-1 bg-gradient-to-r ${member.gradient} rounded-full text-white text-sm font-bold mb-4`}>
                      {member.badge}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-purple-300 font-semibold mb-4">{member.role}</p>
                    <p className="text-gray-400 mb-6 leading-relaxed text-sm sm:text-base">{member.desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.skills.map((skill, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Vision */}
            <div className="max-w-5xl mx-auto">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-3xl blur-xl opacity-50"></div>
                <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-purple-500/30">
                  <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Our Vision
                  </h2>
                  <p className="text-xl sm:text-xl text-center font-semibold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent mb-6 sm:mb-8">
                    Turning your cherished moments into eternal meowments
                  </p>
                  <p className="text-lg sm:text-lg text-gray-300 text-center leading-relaxed mb-6 sm:mb-8">
                    Turn every shared spark into a living, evolving meowment.
                    We’re reimagining collaborative storytelling: one prompt at a time, your moments fuse with the community’s creativity, transforming everyday memories into magical, ever‑growing tales. Every relay keeps your meowment alive, and every creator makes it shine.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
                    <span className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-purple-500/30 rounded-full text-pink-300 font-semibold text-sm sm:text-base">
                      😸
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;