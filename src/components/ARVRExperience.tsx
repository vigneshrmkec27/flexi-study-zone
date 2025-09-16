import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Box, 
  Eye, 
  Smartphone, 
  Monitor, 
  Play, 
  Info, 
  Star,
  Headphones,
  Camera,
  Cpu
} from 'lucide-react';

const ARVRExperience: React.FC = () => {
  const { t } = useLanguage();
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDemoClick = async (demoType: string) => {
    setIsLoading(true);
    setActiveDemo(demoType);
    
    // Simulate loading/launching demo
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const arExperiences = [
    {
      id: 'solar-system',
      title: '🌍 Solar System Explorer',
      description: 'Explore planets and their orbits in 3D space',
      difficulty: 'Beginner',
      duration: '5-10 min',
      subjects: ['Science', 'Astronomy'],
      features: ['3D Models', 'Interactive', 'Voice Narration']
    },
    {
      id: 'anatomy',
      title: '🫀 Human Anatomy',
      description: 'Interactive 3D human body exploration',
      difficulty: 'Intermediate',
      duration: '10-15 min',
      subjects: ['Biology', 'Health'],
      features: ['Detailed Models', 'Layer View', 'Quiz Mode']
    },
    {
      id: 'chemistry',
      title: '⚗️ Molecular Lab',
      description: 'Build and visualize chemical compounds',
      difficulty: 'Advanced',
      duration: '15-20 min',
      subjects: ['Chemistry', 'Physics'],
      features: ['Molecule Builder', 'Reactions', 'Formulas']
    }
  ];

  const vrExperiences = [
    {
      id: 'ancient-rome',
      title: '🏛️ Ancient Rome Tour',
      description: 'Walk through the Roman Forum and Colosseum',
      difficulty: 'Beginner',
      duration: '15-20 min',
      subjects: ['History', 'Culture'],
      features: ['360° Views', 'Historical Audio', 'Interactive Objects']
    },
    {
      id: 'ocean-depths',
      title: '🌊 Ocean Exploration',
      description: 'Dive deep into marine ecosystems',
      difficulty: 'Intermediate',
      duration: '20-25 min',
      subjects: ['Marine Biology', 'Geography'],
      features: ['Underwater Environment', 'Marine Life', 'Depth Simulation']
    },
    {
      id: 'space-station',
      title: '🚀 International Space Station',
      description: 'Experience zero gravity and space exploration',
      difficulty: 'Advanced',
      duration: '25-30 min',
      subjects: ['Physics', 'Astronomy'],
      features: ['Zero Gravity', 'Space Walk', 'Mission Control']
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-success/20 text-success';
      case 'Intermediate':
        return 'bg-warning/20 text-warning';
      case 'Advanced':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-secondary';
    }
  };

  const renderDemo = () => {
    if (!activeDemo || isLoading) return null;

    return (
      <Card className="p-8 text-center card-elevated animate-bounce-in">
        <div className="mb-6">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-achievement rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            {activeDemo.includes('ar') ? (
              <Camera className="w-12 h-12 text-white" />
            ) : (
              <Headphones className="w-12 h-12 text-white" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gradient mb-2">
            {activeDemo.includes('ar') ? 'AR Experience Active' : 'VR Experience Active'}
          </h3>
          <p className="text-muted-foreground">
            This is a demo placeholder. In a real app, this would launch the {activeDemo.includes('ar') ? 'AR' : 'VR'} experience.
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-achievement/10 rounded-lg p-6 mb-6">
          <p className="text-sm text-muted-foreground mb-4">Demo Features:</p>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Cpu className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-sm font-medium">Real-time Rendering</p>
            </div>
            <div className="text-center">
              <Eye className="w-8 h-8 mx-auto mb-2 text-success" />
              <p className="text-sm font-medium">Immersive Experience</p>
            </div>
          </div>
        </div>

        <Button 
          onClick={() => setActiveDemo(null)}
          variant="outline"
          className="btn-hero"
        >
          Exit Demo
        </Button>
      </Card>
    );
  };

  if (activeDemo && !isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {renderDemo()}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-12 text-center card-elevated">
          <div className="animate-spin w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold mb-2">Launching Experience...</h3>
          <p className="text-muted-foreground">Please wait while we prepare your immersive learning environment</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-gradient mb-2">
          {t('ar.title')} 🥽
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('ar.subtitle')}
        </p>
      </div>

      {/* Technology Requirements */}
      <Alert className="animate-slide-up">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Technology Requirements:</strong> These demos require a modern browser with WebXR support. 
          For best AR experience, use a mobile device. For VR, use a VR headset or compatible device.
        </AlertDescription>
      </Alert>

      {/* AR Experiences */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Smartphone className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Augmented Reality Experiences</h2>
            <p className="text-muted-foreground">Overlay digital content onto the real world</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {arExperiences.map((experience, index) => (
            <Card 
              key={experience.id} 
              className="p-6 card-elevated hover:scale-105 transition-transform duration-300 animate-bounce-in"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{experience.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{experience.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(experience.difficulty)}>
                      {experience.difficulty}
                    </Badge>
                    <Badge variant="outline">⏱️ {experience.duration}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {experience.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {experience.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => handleDemoClick(`ar-${experience.id}`)}
                className="w-full btn-hero"
              >
                <Camera className="w-4 h-4 mr-2" />
                {t('ar.viewInAR')}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* VR Experiences */}
      <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-achievement/10 rounded-lg">
            <Monitor className="w-6 h-6 text-achievement" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">Virtual Reality Experiences</h2>
            <p className="text-muted-foreground">Immerse yourself in completely virtual environments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vrExperiences.map((experience, index) => (
            <Card 
              key={experience.id} 
              className="p-6 card-elevated hover:scale-105 transition-transform duration-300 animate-bounce-in"
              style={{ animationDelay: `${0.5 + index * 0.1}s` }}
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">{experience.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{experience.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(experience.difficulty)}>
                      {experience.difficulty}
                    </Badge>
                    <Badge variant="outline">⏱️ {experience.duration}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {experience.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Features:</p>
                <div className="flex flex-wrap gap-1">
                  {experience.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={() => handleDemoClick(`vr-${experience.id}`)}
                className="w-full btn-achievement"
              >
                <Headphones className="w-4 h-4 mr-2" />
                {t('ar.viewInVR')}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Getting Started Guide */}
      <Card className="p-6 card-gradient animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <h3 className="text-lg font-semibold mb-4">Getting Started with AR/VR Learning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary" />
              For AR Experiences:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use a smartphone or tablet with camera</li>
              <li>• Ensure good lighting conditions</li>
              <li>• Allow camera permissions when prompted</li>
              <li>• Point device at flat surfaces for best results</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Monitor className="w-4 h-4 text-achievement" />
              For VR Experiences:
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• VR headset recommended (Oculus, HTC Vive, etc.)</li>
              <li>• Desktop with mouse/keyboard also supported</li>
              <li>• Use headphones for immersive audio</li>
              <li>• Ensure stable internet connection</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ARVRExperience;