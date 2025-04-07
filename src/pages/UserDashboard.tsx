
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/layout/header';
import { useAppContext } from '@/context/AppContext';
import { ProgressBar } from '@/components/ui/progress-bar';
import { LevelBadge } from '@/components/ui/level-badge';
import { QuestCard } from '@/components/ui/quest-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Flame, Star, XCircle } from 'lucide-react';

const UserDashboard = () => {
  const { user, isLoading } = useAuth();
  const { stats, quests, missions, toggleQuestCompletion } = useAppContext();
  const [quote, setQuote] = React.useState("");

  // Redirect if not authenticated
  if (!isLoading && !user) {
    return <Navigate to="/auth" replace />;
  }
  
  const quotes = [
    "The secret of getting ahead is getting started.",
    "Your only limit is you.",
    "Don't stop when you're tired. Stop when you're done.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
  ];

  React.useEffect(() => {
    // Get a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex]);
  }, []);

  const dailyQuests = quests.filter(quest => quest.category === "daily");
  const pendingDailyQuests = dailyQuests.filter(quest => !quest.completed);
  const completedDailyQuests = dailyQuests.filter(quest => quest.completed);

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-10">
      <Header />
      
      <main className="container px-4 py-6 md:py-8">
        {/* User Welcome */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Welcome back, {user?.email?.split('@')[0] || 'User'}</h1>
          <p className="text-muted-foreground">Track your progress and complete your quests.</p>
        </div>
        
        {/* Motivational Quote */}
        <div className="mb-8 text-center">
          <p className="text-lg font-medium italic text-muted-foreground">"{quote}"</p>
        </div>
        
        {/* Level & XP Stats */}
        <div className="mb-8 flex flex-col items-center justify-center space-y-4">
          <LevelBadge level={stats.level} size="lg" />
          <h2 className="text-xl font-bold">Level {stats.level}</h2>
          <ProgressBar 
            value={stats.xp} 
            max={stats.xpToNextLevel} 
            showValue={true} 
            className="max-w-sm" 
          />
        </div>
        
        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Level</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.level}</div>
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.streak} days</div>
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">XP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.xp}</div>
                <Star className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Gold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{stats.gold}</div>
                <svg 
                  className="h-5 w-5 text-amber-500" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 16.5a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
                  <path d="M14.25 8.25h-4.5a.75.75 0 0 0-.75.75v6a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75V9a.75.75 0 0 0-.75-.75zm-.75 6h-3v-4.5h3v4.5z" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Daily Quests */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Daily Quests</h2>
            <span className="text-sm text-muted-foreground">
              {completedDailyQuests.length}/{dailyQuests.length} completed
            </span>
          </div>
          
          {dailyQuests.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">
              <XCircle className="mx-auto mb-2 h-6 w-6" />
              <p>No daily quests available</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dailyQuests.map(quest => (
                <QuestCard 
                  key={quest.id} 
                  quest={quest} 
                  onToggle={toggleQuestCompletion} 
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Missions Progress */}
        {missions.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold">Main Missions</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {missions.map(mission => (
                <Card key={mission.id}>
                  <CardHeader>
                    <CardTitle>{mission.title}</CardTitle>
                    {mission.description && (
                      <CardDescription>{mission.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span className="font-medium">{mission.progress}%</span>
                      </div>
                      <ProgressBar 
                        value={mission.progress} 
                        max={100} 
                        barClassName={
                          mission.progress === 100 
                            ? "bg-green-500" 
                            : mission.progress > 50 
                              ? "bg-blue-500" 
                              : undefined
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;
