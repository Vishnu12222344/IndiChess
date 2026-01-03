import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Trophy, Swords, Clock, ChevronRight, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { authApi } from '@/lib/api';
import { ChessKnight } from '@/components/ChessIcon';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authTestResult, setAuthTestResult] = useState<string | null>(null);
  const [isTestingAuth, setIsTestingAuth] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: 'Signed out',
      description: 'See you next time!',
    });
    navigate('/login');
  };

  const handleTestAuth = async () => {
    setIsTestingAuth(true);
    try {
      const result = await authApi.testAuth();
      setAuthTestResult(result);
      toast({
        title: 'Auth Test Successful',
        description: result,
      });
    } catch (error) {
      toast({
        title: 'Auth Test Failed',
        description: 'Could not verify authentication',
        variant: 'destructive',
      });
    } finally {
      setIsTestingAuth(false);
    }
  };

  const stats = [
    { label: 'Games Played', value: '0', icon: Swords },
    { label: 'Wins', value: '0', icon: Trophy },
    { label: 'Play Time', value: '0h', icon: Clock },
  ];

  const quickActions = [
    { label: 'Play Online', description: 'Find a random opponent', primary: true },
    { label: 'Play vs Computer', description: 'Practice with AI' },
    { label: 'Create Game', description: 'Invite a friend' },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChessKnight className="w-8 h-8 text-primary" />
            <span className="font-display text-xl font-semibold">IndiChess</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-2">Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-12 animate-fade-in">
          <h1 className="text-4xl font-display font-bold mb-2">
            Welcome back, <span className="text-gradient">{user?.email?.split('@')[0]}</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Ready to play some chess?
          </p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="card-glass animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-display font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="mb-12">
          <h2 className="text-xl font-display font-semibold mb-6">Quick Play</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={action.label}
                className={`card-glass text-left transition-all duration-300 hover:scale-[1.02] animate-fade-in ${
                  action.primary ? 'ring-2 ring-primary/50 bg-primary/5' : ''
                }`}
                style={{ animationDelay: `${(i + 3) * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-foreground">{action.label}</div>
                    <div className="text-sm text-muted-foreground">{action.description}</div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
