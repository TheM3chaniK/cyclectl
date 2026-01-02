'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { JsonUploadModal } from './json-upload-modal'; // New import

interface JsonUploadProps {
  onUploadSuccess: () => void;
  projectName: string;
}

export function JsonUpload({ onUploadSuccess, projectName }: JsonUploadProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setIsModalOpen(true)}>Load JSON</Button>
      <JsonUploadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUploadSuccess={onUploadSuccess}
        projectName={projectName}
      />
    </>
  );
}
