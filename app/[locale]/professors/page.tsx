'use client';

import { useEffect, useRef, useState } from 'react';
import { listProfessors, checkInvitationStatus,deductcredit } from './actions';
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import BuyProduct from '@/components/razorpay/BuyProduct';
import { InlineWidget,useCalendlyEventListener } from "react-calendly";
import Link from 'next/link';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, Plus, RefreshCw } from "lucide-react";
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
import { toast } from 'react-hot-toast';

type Professor = {
  id: number;
  name: string;
  department: string;
  bio: string;
  email: string;
  calendlyEventLink: string | null;
};

async function deductCredits() {
  await deductcredit();
  console.log("deducting the credits");
  window.location.reload();

}

export default function ProfessorsPage() {
  const appointmentRef = useRef<HTMLDivElement | null>(null);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [showCalendly, setShowCalendly] = useState(false);
  const { data: session } = useSession(); 
  const [meetingScheduled, setMeetingScheduled] = useState(false);
  const { locale } = useParams();


  const handleEventScheduled = () => {
    setMeetingScheduled(true);
    deductCredits();
  };

  useCalendlyEventListener({
    onEventScheduled: handleEventScheduled,
  });

  useEffect(() => {
    fetchProfessors();
  }, [pagination.pageIndex, pagination.pageSize]);

  const fetchProfessors = async () => {
    try {
      setLoading(true);
      const data = await listProfessors({
        limit: pagination.pageSize,
        offset: pagination.pageIndex * pagination.pageSize
      });
      setProfessors(data);
    } catch (error) {
      console.error("Failed to load professors", error);
      toast.error("Failed to load professors");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckStatus = async (professor: Professor) => {
    try {
      const result = await checkInvitationStatus(professor.id, professor.email);
      if (result.status === 'accepted') {
        toast.success(`${professor.name}'s Calendly link is now available`);
      } 
    } catch (error) {
      console.error("Error checking invitation status", error);
      toast.error("Failed to check invitation status");
    }
  };

  const handleBookAppointment = (professor: Professor) => {
    setSelectedProfessor(professor);
    setShowCalendly(true);
    setTimeout(() => {
      appointmentRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    
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
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
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
      id: "calendly",
      header: "Calendly Status",
      cell: ({ row }) => {
        const professor = row.original;
        return professor.calendlyEventLink ? (
          <Button
            onClick={() => handleBookAppointment(professor)}
            variant="outline"
            size="sm"
            className="bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
          >
            Book Appointment
          </Button>
        ) : (
          <Button
            onClick={() => handleCheckStatus(professor)}
            variant="outline"
            size="sm"
            className="bg-yellow-500 text-white hover:bg-yellow-600 transition-colors duration-200"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Check Status
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
      <CardHeader className="bg-gray-50 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <CardTitle className="text-2xl font-bold text-gray-800">Professors</CardTitle>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <Link href={`/${locale}/professors/add`}>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Professor
            </Button>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Credits:</span>
            <span className="text-sm font-bold text-blue-600">{session?.user?.credits}</span>
          </div>
          <BuyProduct />
        </div>
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
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 text-sm"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-4 py-2 text-sm"
            >
              Next <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      {showCalendly && selectedProfessor && (
        <div ref={appointmentRef} className="mt-4 p-4 bg-gray-50 rounded-b-lg">
          <h2 className="text-xl font-semibold mb-4">Book Appointment with {selectedProfessor.name}</h2>
          <InlineWidget
            url={selectedProfessor.calendlyEventLink}
            styles={{ height: '600px' }}
            prefill={{
              email: session?.user?.email,
              name: session?.user?.name,
            }}
          />
        </div>
      )}
    </Card>
  );
}