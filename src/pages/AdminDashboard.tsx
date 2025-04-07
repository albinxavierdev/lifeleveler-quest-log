
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Users, ArrowUpDown, Search, Ban, CheckCircle } from 'lucide-react';
import { Profile } from '@/types/auth';

type AdminUserProfile = Profile & { email?: string };

const AdminDashboard = () => {
  const { user, isLoading, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<AdminUserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<'username' | 'created_at' | 'plan'>('created_at');

  // Redirect if not authenticated or not an admin
  if (!isLoading && (!user || !isAdmin)) {
    return <Navigate to={user ? '/dashboard' : '/auth'} replace />;
  }

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      // Fetch user emails (requires admin access)
      const { data: authUsers, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) {
        // If not authorized for admin functions, just use profiles
        setUsers(profiles || []);
      } else {
        // Merge profile data with auth data
        const mergedUsers = profiles?.map(profile => {
          const authUser = authUsers?.users?.find(u => u.id === profile.id);
          return {
            ...profile,
            email: authUser?.email
          };
        }) || [];
        setUsers(mergedUsers);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error fetching users',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: 'username' | 'created_at' | 'plan') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.username?.toLowerCase().includes(searchLower) ||
      user.full_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.plan?.toLowerCase().includes(searchLower)
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const fieldA = a[sortField] || '';
    const fieldB = b[sortField] || '';
    
    const comparison = typeof fieldA === 'string' && typeof fieldB === 'string'
      ? fieldA.localeCompare(fieldB)
      : String(fieldA).localeCompare(String(fieldB));
      
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleChangePlan = async (userId: string, newPlan: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ plan: newPlan })
        .eq('id', userId);
        
      if (error) throw error;
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, plan: newPlan } : user
      ));
      
      toast({
        title: 'Plan updated',
        description: `User's plan has been updated to ${newPlan}.`,
      });
    } catch (error) {
      console.error('Error updating plan:', error);
      toast({
        title: 'Error updating plan',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading || loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-10">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="mr-4 flex items-center">
            <Users className="mr-2 h-5 w-5" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <Button asChild variant="outline">
            <a href="/dashboard">Back to User Dashboard</a>
          </Button>
        </div>
      </header>
      
      <main className="container px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Users</CardTitle>
              <CardDescription>Total registered users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Pro Users</CardTitle>
              <CardDescription>Users on premium plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {users.filter(user => user.plan === 'pro').length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Free Users</CardTitle>
              <CardDescription>Users on free plan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {users.filter(user => user.plan === 'free').length}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">User Management</h2>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-4 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('username')} className="p-0 font-medium">
                      Username <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('created_at')} className="p-0 font-medium">
                      Joined <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" onClick={() => handleSort('plan')} className="p-0 font-medium">
                      Plan <ArrowUpDown className="ml-1 h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.username || '—'}</TableCell>
                      <TableCell>{user.email || '—'}</TableCell>
                      <TableCell>{user.full_name || '—'}</TableCell>
                      <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          user.plan === 'pro' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          {user.plan}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {user.plan === 'free' ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleChangePlan(user.id, 'pro')}
                            >
                              <CheckCircle className="mr-1 h-3 w-3" /> Make Pro
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleChangePlan(user.id, 'free')}
                            >
                              <Ban className="mr-1 h-3 w-3" /> Make Free
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
