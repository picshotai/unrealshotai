import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { modelRowWithSamples } from "@/types/utils";
import { Button } from "@/components/ui/button";

type ModelsTableProps = {
  models: modelRowWithSamples[];
};

export default function ModelsTable({ models }: ModelsTableProps) {
  const router = useRouter();

  const handleRedirect = (id: number) => {
    router.push(`/models/${id}`);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-100">
      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100">
            <TableHead className="py-3 px-4 font-semibold text-gray-900 w-1/4">Name</TableHead>
            <TableHead className="py-3 px-4 font-semibold text-gray-900 w-1/4">Status</TableHead>
            <TableHead className="py-3 px-4 font-semibold text-gray-900 w-1/4">Samples</TableHead>
            <TableHead className="py-3 px-4 font-semibold text-gray-900 w-1/4">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {models?.map((model) => (
            <TableRow
              key={model.id}
              onClick={() => handleRedirect(model.id)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <TableCell className="py-4 px-4 font-medium text-gray-900 truncate">{model.name}</TableCell>
              <TableCell className="py-4 px-4">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={model.status === "processing" ? "secondary" : "default"}
                    className={`px-2 rounded py-1 text-xs font-medium ${
                      model.status === "processing" ? "bg-gray-200 text-gray-700 border border-gray-300" : "bg-gray-900 text-white"
                    }`}
                  >
                    {model.status === "processing" ? "Training" : model.status}
                  </Badge>
                  {model.status === "processing" && (
                    <Loader2 className="h-4 w-4 animate-spin text-gray-600" />
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4 px-4">
                <div className="flex items-center space-x-2 overflow-x-auto">
                  {model.samples.slice(0, 3).map((sample, index) => (
                    <Avatar key={index} className="h-8 w-8 border-2 border-gray-100 shadow-sm flex-shrink-0">
                      <AvatarImage
                        src={(sample.uri?.startsWith("users/"))
                          ? `/api/img-proxy?key=${encodeURIComponent(sample.uri)}`
                          : sample.uri}
                        alt={`Sample ${index + 1}`}
                      />
                      <AvatarFallback className="bg-gray-200 text-gray-700 text-xs font-medium">
                        {index + 1}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {model.samples.length > 3 && (
                    <Badge variant="outline" className="rounded-full px-2 py-1 text-xs font-medium text-gray-600 border-gray-400 flex-shrink-0 hover:bg-gray-100">
                      <Plus className="h-3 w-3 mr-1" />
                      {model.samples.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4 px-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRedirect(model.id);
                  }}
                >
                  View
                </Button>
              </TableCell>
              
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}