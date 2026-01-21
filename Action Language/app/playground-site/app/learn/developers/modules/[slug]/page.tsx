import { notFound } from 'next/navigation';
import { modules, getModuleBySlug } from '../../../data/modules';
import ModuleLayout from '../../../components/ModuleLayout';

// Import individual module content components
import UnderstandingDisabilityModels from './content/understanding-disability-models';
import VisualDisabilities from './content/visual-disabilities';
import AuditoryDisabilities from './content/auditory-disabilities';
import MotorDisabilities from './content/motor-disabilities';
import CognitiveDisabilities from './content/cognitive-disabilities';
import SpeechDisabilities from './content/speech-disabilities';
import SeizureDisorders from './content/seizure-disorders';
import TemporaryAndSituationalDisabilities from './content/temporary-situational-disabilities';
import MultipleDisabilities from './content/multiple-disabilities';
import ScreenReadersDeepDive from './content/screen-readers-deep-dive';

// Map slugs to content components
const moduleContentMap: Record<string, React.ComponentType> = {
  'understanding-disability-models': UnderstandingDisabilityModels,
  'visual-disabilities': VisualDisabilities,
  'auditory-disabilities': AuditoryDisabilities,
  'motor-disabilities': MotorDisabilities,
  'cognitive-disabilities': CognitiveDisabilities,
  'speech-disabilities': SpeechDisabilities,
  'seizure-disorders': SeizureDisorders,
  'temporary-situational-disabilities': TemporaryAndSituationalDisabilities,
  'multiple-disabilities': MultipleDisabilities,
  'screen-readers-deep-dive': ScreenReadersDeepDive,
};

export default async function ModulePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const module = getModuleBySlug(slug);

  if (!module) {
    notFound();
  }

  // Get previous and next modules
  const currentIndex = modules.findIndex((m) => m.id === module.id);
  const previousModule = currentIndex > 0 ? modules[currentIndex - 1] : undefined;
  const nextModule = currentIndex < modules.length - 1 ? modules[currentIndex + 1] : undefined;

  // Get the content component for this module
  const ContentComponent = moduleContentMap[slug];

  if (!ContentComponent) {
    return (
      <ModuleLayout module={module} track="developer" previousModule={previousModule} nextModule={nextModule}>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Module Content Coming Soon</h2>
          <p className="text-gray-700 mb-6">
            This module is being developed. Check back soon for complete content with code examples and interactive exercises.
          </p>
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6 text-left max-w-2xl mx-auto">
            <h3 className="font-semibold text-blue-900 mb-2">What this module will cover:</h3>
            <p className="text-blue-800">{module.description}</p>
          </div>
        </div>
      </ModuleLayout>
    );
  }

  return (
    <ModuleLayout module={module} track="developer" previousModule={previousModule} nextModule={nextModule}>
      <ContentComponent />
    </ModuleLayout>
  );
}

// Generate static params for all modules
export function generateStaticParams() {
  return modules.map((module) => ({
    slug: module.slug,
  }));
}
