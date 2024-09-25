'use client';

import { useEffect, useRef, useState } from 'react';
import { listProfessors } from './actions';
import { useSession } from "next-auth/react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
declare global {
  interface Window {
    Calendly: {
      initInlineWidget: (options: {
        url: string;
        parentElement: Element;
        prefill?: Record<string, any>;
        utm?: Record<string, any>;
      }) => void;
    };
  }
}


type Professor = {
  id: number;
  name: string;
  department: string;
  bio: string;
  calendlyEventLink: string;
};



export default function ProfessorsPage() {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [showCalendly, setShowCalendly] = useState(false);
  const appointmentRef = useRef<HTMLDivElement | null>(null);
  const calendlyRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession(); 

  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const data = await listProfessors({
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize
        });
        console.log("Fetched Professors: ", data);
        setProfessors(data);
      } catch (error) {
        console.error("Failed to load professors", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfessors();
  }, [pagination.pageIndex, pagination.pageSize]);

  useEffect(() => {
    const loadCalendlyScript = () => {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    };

    loadCalendlyScript();
  }, []);

  useEffect(() => {
    if (showCalendly && selectedProfessor && selectedProfessor.calendlyEventLink && calendlyRef.current) {
      if (window.Calendly) {
        window.Calendly.initInlineWidget({
          url: selectedProfessor.calendlyEventLink,
          parentElement: calendlyRef.current,
          prefill: {
            email: session?.user?.email,
            name: session?.user?.name,
          },
          utm: {
            utm_campaign: 'GoogleMeetIntegration', 
            utm_medium: 'GoogleMeet',
          },
        });
      }
    }
  }, [showCalendly, selectedProfessor, session]);

  const handleBookAppointment = (professor: Professor) => {
    setSelectedProfessor(professor);
    setShowCalendly(false);
    appointmentRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConfirmAppointment = () => {
    if (selectedProfessor?.calendlyEventLink) {
      setShowCalendly(true);
    } else {
      console.error("No valid Calendly link found for the selected professor.");
    }
  };

  const columns: ColumnDef<Professor>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100"
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "department",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-gray-100"
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "bio",
      header: "Bio",
      cell: ({ row }) => (
        <div className="max-w-xs truncate" title={row.getValue("bio")}>
          {row.getValue("bio")}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const professor = row.original;
        return (
          <Button
            onClick={() => handleBookAppointment(professor)}
            variant="outline"
            size="sm"
            className="bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
          >
            Book Appointment
          </Button>
        );
      },
    },
  ];

  const table = useReactTable({
    data: professors,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  if (loading) {
    return (
      <Card className="w-full shadow-lg">
        <CardContent className="pt-6">
          <p className="text-center text-gray-600">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-gray-50">
        <CardTitle className="text-2xl font-bold text-gray-800">Professors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-100">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-gray-500">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="text-sm text-gray-700">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-50"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
      <div ref={appointmentRef}>
        {selectedProfessor && (
          <div className="bg-gray-100 py-6 px-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Confirm Appointment with {selectedProfessor.name}
            </h3>
            <p className="text-gray-600 mb-4">
              Department: {selectedProfessor.department}
            </p>
            <Button
              onClick={handleConfirmAppointment}
              variant="outline"
              className="mb-6 bg-blue-500 text-black hover:bg-blue-600 transition-colors duration-200"
            >
              Confirm Appointment
            </Button>
            {showCalendly && (
              <div ref={calendlyRef} className="w-full" style={{ height: '800px', overflow: 'hidden' }}>
                {/* Calendly widget will be injected here */}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}