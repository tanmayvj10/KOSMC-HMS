
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Phone, Mail, Calendar, Trash2 } from "lucide-react";
import { StaffMember } from '@/models/types';
import { format } from 'date-fns';

interface StaffCardProps {
  staff: StaffMember;
  onEdit: () => void;
  onDelete?: () => void;
  allStaff: StaffMember[];
}

export function StaffCard({ staff, onEdit, onDelete, allStaff }: StaffCardProps) {
  // Get manager's name
  const manager = staff.reportTo 
    ? allStaff.find(member => member.id === staff.reportTo) 
    : undefined;

  // Format joining date
  const formattedDate = staff.joiningDate 
    ? format(new Date(staff.joiningDate), 'dd MMM yyyy')
    : '';

  // Status color map
  const statusColor = {
    active: "bg-green-100 text-green-800",
    "on-leave": "bg-yellow-100 text-yellow-800",
    terminated: "bg-red-100 text-red-800"
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="relative pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={staff.image} alt={staff.name} />
              <AvatarFallback>{getInitials(staff.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-base">{staff.name}</h3>
              <p className="text-sm text-muted-foreground">{staff.position}</p>
            </div>
          </div>
          <Badge className={statusColor[staff.status]}>{staff.status}</Badge>
        </div>
        <div className="absolute top-2 right-2 flex">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onEdit}
          >
            <Edit2 size={14} />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={onDelete}
            >
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-2">
          <Phone size={14} className="text-muted-foreground" />
          <span>{staff.phone}</span>
        </div>
        {staff.email && (
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-muted-foreground" />
            <span className="truncate">{staff.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Calendar size={14} className="text-muted-foreground" />
          <span>Joined: {formattedDate}</span>
        </div>
      </CardContent>
      {manager && (
        <CardFooter className="border-t pt-3 text-xs">
          <span className="text-muted-foreground">Reports to: </span>
          <span className="font-medium ml-1">{manager.name}</span>
        </CardFooter>
      )}
    </Card>
  );
}
