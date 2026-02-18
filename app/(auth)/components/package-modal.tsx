'use client'

import {
  ShieldCheck,
  Box,
  Crown,
  Check,
  LockKeyholeOpen,
} from 'lucide-react'
import CheckInboxModal from './mail-send-modal'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { App_url } from '@/constant/static'

type PackageType = 'FREE' | 'GO' | 'PLUS' | 'VIP'

export default function PackagesModal({
  onClose,
}: {
  onClose?: () => void
}) {
  const [emailVerificationPopup, setEmailVerificationPopup] = useState(false)
  const [selectedPackage, setSelectedPackage] =
    useState<PackageType>('FREE')

  const router = useRouter()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm max-md:p-3">
      <div className="w-[470px] rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b bg-[#F9F9F9]">
          <h2 className="text-lg font-semibold text-gray-900">
            Packages
          </h2>
        </div>

        {/* Package List */}
        <div className="p-4 space-y-3">
          {/* FREE */}
          <SelectablePackage
            selected={selectedPackage === 'FREE'}
            onClick={() => setSelectedPackage('FREE')}
            icon={<LockKeyholeOpen size={22} />}
            title="ZECCO FREE"
            desc="Free profile to search, safe etc"
          />

          {/* GO */}
          <SelectablePackage
            selected={selectedPackage === 'GO'}
            onClick={() => setSelectedPackage('GO')}
            icon={<ShieldCheck size={22} />}
            title="ZECCO GO"
            desc="Paid package and availability of advanced AI agents and personal property advisor"
          />

          {/* PLUS */}
          <SelectablePackage
            selected={selectedPackage === 'PLUS'}
            onClick={() => setSelectedPackage('PLUS')}
            icon={<Box size={22} />}
            title="ZECCO PLUS"
            desc="Paid package - Same as GO but including Spain visit and viewings with local specialist"
          />

          {/* VIP */}
          <SelectablePackage
            selected={selectedPackage === 'VIP'}
            onClick={() => setSelectedPackage('VIP')}
            icon={<Crown size={22} />}
            title="ZECCO VIP"
            desc="Tailor made service for property searches from € 2 mln onwards"
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t px-4 py-4">
          <button
            onClick={onClose}
            className="flex-1 font-circular_std rounded-lg bg-[#000037] px-4 py-2.5 text-sm font-medium text-white"
          >
            Cancel
          </button>
          <button
            onClick={() => setEmailVerificationPopup(true)}
            className="flex-1 font-circular_std rounded-lg bg-[#0C87F1] px-4 py-2.5 text-sm font-medium text-white"
          >
            Apply Coupon
          </button>
        </div>
      </div>

      {emailVerificationPopup && (
        <CheckInboxModal
          onClose={() => setEmailVerificationPopup(false)}
          onReturn={() =>
            router.push(App_url.link.INITIAL_URL)
          }
        />
      )}
    </div>
  )
}

/* ========================= */
/* Selectable Package Card */
/* ========================= */
function SelectablePackage({
  icon,
  title,
  desc,
  selected,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl p-[2px] transition ${selected
        ? 'bg-gradient-to-r from-[#2563EB] via-[#92B1F5] to-[#2563EB]'
        : 'bg-transparent'
        }`}
    >
      <div
        className={`relative flex items-center justify-between gap-3 rounded-[10px] px-4 py-3 ${selected
          ? 'bg-white'
          : 'bg-white border border-gray-200 hover:border-blue-300'
          }`}
      >
        <div className="flex items-start gap-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </div>

          <div className="flex-1">
            <p className="text-md font-circular_std tracking-wider font-medium text-gray-900">
              {title}
            </p>
            <p className="text-sm text-gray-600">
              {desc}
            </p>
          </div>
        </div>

        {selected && (
          <div className="w-6 h-6 p-1 rounded-full bg-green-500 flex justify-center items-center">
            <Check
              size={24}
              className=" text-white"
            />
          </div>
        )}
      </div>
    </div>
  )
}
