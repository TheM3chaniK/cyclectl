'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { JsonUploadModal } from './json-upload-modal'; // New import

interface JsonUploadProps {
  onUploadSuccess: () => void;
  projectId: string | undefined;
}

export function JsonUpload({ onUploadSuccess, projectId }: JsonUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)} disabled={!projectId}>Load JSON</Button>
      <JsonUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={onUploadSuccess}
        projectId={projectId}
      />
    </>
  );
}
