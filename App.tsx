import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { SupabaseModal } from './components/SupabaseModal';
import { HomePage } from './pages/HomePage';
import { AnalyzerPage } from './pages/AnalyzerPage';
import { JobMatchingPage } from './pages/JobMatchingPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { DashboardPage } from './pages/DashboardPage';
import { AboutPage } from './pages/AboutPage';

import { ResumeData, MatchResult, JobRole, AnalysisHistoryRecord } from './types';
import { SAMPLE_RESUMES, PRESET_JOB_ROLES } from './services/sampleData';
import { analyzeResumeText } from './services/nlpAnalyzer';
import { calculateJobMatch } from './services/jobMatcher';
import { saveAnalysisRecord } from './services/supabase';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [currentResume, setCurrentResume] = useState<ResumeData | null>(null);
  const [currentMatch, setCurrentMatch] = useState<MatchResult | null>(null);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);

  // Initialize with the first realistic sample resume so the UI is immediately alive
  useEffect(() => {
    const defaultSample = SAMPLE_RESUMES[0];
    const initialResume = analyzeResumeText(defaultSample.content, defaultSample.fileName, 24500);
    setCurrentResume(initialResume);

    // Initial match with Frontend Developer role
    const defaultJob = PRESET_JOB_ROLES[0];
    const initialMatch = calculateJobMatch(initialResume, {
      title: defaultJob.title,
      description: defaultJob.description,
      requiredSkills: defaultJob.requiredSkills,
      preferredSkills: defaultJob.preferredSkills,
      roleId: defaultJob.id
    });
    setCurrentMatch(initialMatch);

    // Persist default record
    saveAnalysisRecord(initialResume, initialMatch);
  }, []);

  const handleLoadSampleResume = (sampleId: string) => {
    const sample = SAMPLE_RESUMES.find(s => s.id === sampleId);
    if (!sample) return;

    const parsed = analyzeResumeText(sample.content, sample.fileName, 26000);
    setCurrentResume(parsed);

    // Compute match with first preset role
    const defaultJob = PRESET_JOB_ROLES[0];
    const match = calculateJobMatch(parsed, {
      title: defaultJob.title,
      description: defaultJob.description,
      requiredSkills: defaultJob.requiredSkills,
      preferredSkills: defaultJob.preferredSkills,
      roleId: defaultJob.id
    });
    setCurrentMatch(match);
    saveAnalysisRecord(parsed, match);

    // Switch to analyzer tab
    setCurrentTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectRoleForMatching = (role: JobRole) => {
    if (currentResume) {
      const match = calculateJobMatch(currentResume, {
        title: role.title,
        description: role.description,
        requiredSkills: role.requiredSkills,
        preferredSkills: role.preferredSkills,
        roleId: role.id
      });
      setCurrentMatch(match);
      saveAnalysisRecord(currentResume, match);
    }
    setCurrentTab('matching');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestoreFromHistory = (record: AnalysisHistoryRecord) => {
    setCurrentResume(record.resumeData);
    if (record.matchResult) {
      setCurrentMatch(record.matchResult);
    }
    setCurrentTab('analyzer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFBF9] text-stone-800 font-sans selection:bg-[#FFF0F3] selection:text-[#CC2C52]">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSupabaseModal={() => setIsSupabaseModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 pt-6 pb-12">
        {currentTab === 'home' && (
          <HomePage
            onSelectTab={setCurrentTab}
            onLoadSampleResume={handleLoadSampleResume}
          />
        )}

        {currentTab === 'analyzer' && (
          <AnalyzerPage
            currentResume={currentResume}
            onUpdateResume={(resume) => {
              setCurrentResume(resume);
              // Recalculate match for current role
              const defaultJob = PRESET_JOB_ROLES[0];
              const match = calculateJobMatch(resume, {
                title: defaultJob.title,
                description: defaultJob.description,
                requiredSkills: defaultJob.requiredSkills,
                preferredSkills: defaultJob.preferredSkills,
                roleId: defaultJob.id
              });
              setCurrentMatch(match);
            }}
            onNavigateToMatching={() => {
              setCurrentTab('matching');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'matching' && (
          <JobMatchingPage
            currentResume={currentResume}
            currentMatch={currentMatch}
            onUpdateMatch={setCurrentMatch}
            onNavigateToAnalyzer={() => {
              setCurrentTab('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'recommendations' && (
          <RecommendationsPage
            currentResume={currentResume}
            onSelectRoleForMatching={handleSelectRoleForMatching}
            onNavigateToAnalyzer={() => {
              setCurrentTab('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardPage
            currentResume={currentResume}
            currentMatch={currentMatch}
            onRestoreFromHistory={handleRestoreFromHistory}
            onNavigateToAnalyzer={() => {
              setCurrentTab('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'about' && <AboutPage />}
      </main>

      {/* Footer */}
      <Footer onSelectTab={setCurrentTab} />

      {/* Supabase Connection Modal */}
      <SupabaseModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />
    </div>
  );
}

export default App;
