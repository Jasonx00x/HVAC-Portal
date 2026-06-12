export type JobPhotoType = "before" | "after" | "data_plate" | "receipt" | "general";

export type JobPhotoMetadata = {
  id: string;
  job_id: string;
  technician_id?: string;
  file_name: string;
  file_url: string;
  storage_provider: "placeholder" | "supabase" | "google_drive" | "cloudflare_r2" | "aws_s3";
  uploaded_at: string;
  caption?: string;
  photo_type: JobPhotoType;
};

function createPhotoId() {
  return `photo-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export async function uploadJobPhoto({
  jobId,
  technicianId,
  fileName = "field-photo-placeholder.jpg",
  caption,
  photoType = "general"
}: {
  jobId: string;
  technicianId?: string;
  fileName?: string;
  caption?: string;
  photoType?: JobPhotoType;
}): Promise<JobPhotoMetadata> {
  return {
    id: createPhotoId(),
    job_id: jobId,
    technician_id: technicianId,
    file_name: fileName,
    file_url: `/photos/placeholders/${fileName}`,
    storage_provider: "placeholder",
    uploaded_at: new Date().toISOString(),
    caption,
    photo_type: photoType
  };
}

export async function deleteJobPhoto(_photoId: string) {
  return { ok: true };
}

export function getJobPhotoUrl(photo: Pick<JobPhotoMetadata, "file_url">) {
  return photo.file_url;
}
