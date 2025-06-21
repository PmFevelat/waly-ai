'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export const WorkspaceInformation = () => {
  const { user } = useAuth();
  const [workspaceName, setWorkspaceName] = useState('Hec.edu');
  const [workspaceId] = useState('4fd8e222-a171-4de1-9290-4d4b43090672');
  const [copied, setCopied] = useState(false);

  const handleCopyWorkspaceId = async () => {
    try {
      await navigator.clipboard.writeText(workspaceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Workspace */}
      <Card className="bg-white hover:shadow-md transition-shadow duration-200 py-2" style={{ border: '1px solid #E6E6E6' }}>
        <CardContent className="p-3">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Workspace</h2>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="workspaceName" className="text-xs font-medium text-gray-700">
                Workspace name
              </Label>
              <Input
                id="workspaceName"
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Hec.edu"
                className="h-8 text-sm"
                style={{ border: '1px solid #E6E6E6' }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="workspaceId" className="text-xs font-medium text-gray-700">
                Workspace ID
                <span className="text-gray-500 font-normal ml-1">This ID might be needed for support.</span>
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="workspaceId"
                  type="text"
                  value={workspaceId}
                  readOnly
                  className="h-8 text-sm bg-gray-50 cursor-not-allowed"
                  style={{ border: '1px solid #E6E6E6' }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyWorkspaceId}
                  className="h-8 px-3 flex items-center gap-1 text-xs"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 