'use client';

import { updateUserRole } from '@/app/actions/auth.action';
import { toast } from 'sonner';

export function UserTable({ data, currentAdminId }: { data: any[]; currentAdminId: string }) {
  const handleRoleChange = async (userId: string, newRole: any) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success(`ROLE_UPDATED_TO_${newRole}`);
    } catch (err) {
      toast.error('FAILED_TO_UPDATE_ROLE');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {data.map((item) => (
        <div
          key={item.id}
          className="border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="mb-4">
            <p className="text-xl leading-none font-black uppercase">{item.name}</p>
            <p className="text-[10px] font-bold text-zinc-400 uppercase">{item.email}</p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase italic opacity-50">
              Assign_Role
            </label>
            <select
              disabled={item.id === currentAdminId} // Jangan biarkan admin ubah rolenya sendiri (biar gak kekunci)
              defaultValue={item.role}
              onChange={(e) => handleRoleChange(item.id, e.target.value)}
              className="w-full border-4 border-black p-2 text-xs font-black uppercase outline-none focus:bg-yellow-100"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="CASHIER">CASHIER</option>
              <option value="KITCHEN">KITCHEN</option>
            </select>
          </div>

          {item.id === currentAdminId && (
            <p className="mt-2 text-[8px] font-bold text-red-600 uppercase italic">
              *You cannot demote yourself
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
