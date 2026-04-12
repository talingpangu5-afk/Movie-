'use client';

import React, { useState, useEffect } from 'react';
import { Github, ExternalLink, GitBranch, Star, Lock, Globe, RefreshCcw, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  language: string;
  private: boolean;
  updated_at: string;
}

export default function DeveloperPage() {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newRepo, setNewRepo] = useState({
    name: '',
    description: '',
    isPrivate: false
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchRepos = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/github/repos');
      const data = await response.json();
      
      if (response.ok) {
        setRepos(data);
        setIsConnected(true);
      } else {
        setIsConnected(false);
        if (response.status !== 401) {
          toast.error(data.error || 'Failed to fetch repositories');
        }
      }
    } catch (error) {
      console.error('Error fetching repos:', error);
      setIsConnected(false);
      toast.error('Network error while fetching repositories');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRepos();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        toast.success('GitHub connected successfully!');
        fetchRepos();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleConnect = async () => {
    try {
      // Pass the current origin to the server so it can construct the correct redirect_uri
      const origin = window.location.origin;
      const response = await fetch(`/api/auth/github/url?origin=${encodeURIComponent(origin)}`);
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to get authentication URL');
        return;
      }

      const { url } = data;

      const width = 600;
      const height = 700;
      const left = window.screenX + (window.innerWidth - width) / 2;
      const top = window.screenY + (window.innerHeight - height) / 2;

      window.open(
        url,
        'github_oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );
    } catch (error) {
      toast.error('Failed to initiate GitHub connection');
    }
  };

  const handleLogout = async () => {
    // In a real app, we'd call an API to clear the cookie
    // For now, we'll just simulate it or the user can clear their cookies
    toast.info('To disconnect, please clear your browser cookies for this site.');
  };

  const handleCreateRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepo.name.trim()) {
      toast.error('Repository name is required');
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch('/api/github/repos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRepo),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(`Repository "${data.name}" created successfully!`);
        setIsDialogOpen(false);
        setNewRepo({ name: '', description: '', isPrivate: false });
        fetchRepos();
      } else {
        toast.error(data.error || 'Failed to create repository');
      }
    } catch (error) {
      console.error('Error creating repo:', error);
      toast.error('Network error while creating repository');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter">Developer Hub</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect your GitHub account to access your repositories and integrate your development workflow with Movie World.
          </p>
        </div>

        {!isConnected ? (
          <Card className="bg-secondary/20 border-primary/20 overflow-hidden">
            <CardHeader className="text-center pb-8">
              <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                <Github className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Connect GitHub</CardTitle>
              <CardDescription>
                We need access to your repositories to show them here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center pb-12">
              <Button size="lg" onClick={handleConnect} className="bg-primary hover:bg-primary/90 text-white font-bold px-8 h-14 rounded-full">
                <Github className="w-5 h-5 mr-2" />
                Connect with GitHub
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <GitBranch className="w-6 h-6 text-primary" />
                Your Repositories
              </h2>
              <div className="flex gap-2">
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger render={
                    <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      New Repo
                    </Button>
                  } />
                  <DialogContent className="sm:max-w-[425px] bg-background border-primary/20">
                    <DialogHeader>
                      <DialogTitle>Create New Repository</DialogTitle>
                      <DialogDescription>
                        Create a new repository on your GitHub account.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateRepo} className="space-y-6 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Repository Name</Label>
                        <Input
                          id="name"
                          placeholder="my-awesome-movie-app"
                          value={newRepo.name}
                          onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })}
                          className="bg-secondary/50 border-none"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description (Optional)</Label>
                        <Textarea
                          id="description"
                          placeholder="A brief description of your project"
                          value={newRepo.description}
                          onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })}
                          className="bg-secondary/50 border-none resize-none"
                          rows={3}
                        />
                      </div>
                      <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="private" className="flex flex-col gap-1">
                          <span>Private Repository</span>
                          <span className="font-normal text-xs text-muted-foreground">Only you can see this repository.</span>
                        </Label>
                        <Switch
                          id="private"
                          checked={newRepo.isPrivate}
                          onCheckedChange={(checked) => setNewRepo({ ...newRepo, isPrivate: checked })}
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit" disabled={isCreating} className="w-full bg-primary hover:bg-primary/90 text-white font-bold">
                          {isCreating ? (
                            <>
                              <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                              Creating...
                            </>
                          ) : (
                            'Create Repository'
                          )}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={fetchRepos} disabled={isLoading}>
                  <RefreshCcw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>

            {isLoading && repos.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-48 bg-secondary/20 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {repos.map((repo) => (
                  <Card key={repo.id} className="bg-secondary/10 hover:bg-secondary/20 transition-colors border-muted/30">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg font-bold truncate pr-4">
                          {repo.name}
                        </CardTitle>
                        {repo.private ? (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <Globe className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <CardDescription className="line-clamp-2 h-10 mt-1">
                        {repo.description || 'No description provided.'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {repo.language && (
                            <Badge variant="outline" className="text-[10px] uppercase font-bold">
                              {repo.language}
                            </Badge>
                          )}
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {repo.stargazers_count}
                          </div>
                        </div>
                        <a 
                          href={repo.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm font-bold flex items-center gap-1"
                        >
                          View <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {repos.length === 0 && !isLoading && (
              <div className="text-center py-20 bg-secondary/5 rounded-2xl border border-dashed border-muted/30">
                <p className="text-muted-foreground">No repositories found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
