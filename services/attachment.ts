import { api } from "@/lib/api";

export const attachmentService = {
  upload: async (file: File, occurrenceId: number) => {
    const formData = new FormData();
    formData.append("file", file); // O Java espera @RequestParam("file") 
    formData.append("occurrenceId", occurrenceId.toString()); // Vincula ao report 

    // O Axios detecta FormData e seta o header 'multipart/form-data' automaticamente
    const { data } = await api.post("/attachments/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  },
};