"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Trash2, Plus } from "lucide-react"
import type { DemoAsset } from "../lib/types/agent.types"

interface DemoAssetInputProps {
  demoAssets: DemoAsset[]
  onChange: (assets: DemoAsset[]) => void
}

export function DemoAssetInput({ demoAssets, onChange }: DemoAssetInputProps) {
  const addAsset = () => {
    onChange([...demoAssets, { asset_type: "", asset_name: "", link: "" }])
  }

  const removeAsset = (index: number) => {
    onChange(demoAssets.filter((_, i) => i !== index))
  }

  const updateAsset = (index: number, field: keyof DemoAsset, value: string) => {
    const updated = [...demoAssets]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Demo Assets</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addAsset}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Demo Asset
        </Button>
      </div>

      {demoAssets.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-sm text-gray-500">No demo assets added yet</p>
          <p className="text-xs text-gray-400">Click "Add Demo Asset" to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {demoAssets.map((asset, index) => (
            <div key={index} className="rounded-lg border bg-white p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Demo Asset {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAsset(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label htmlFor={`asset-type-${index}`} className="text-xs">Asset Type</Label>
                  <Input
                    id={`asset-type-${index}`}
                    placeholder="e.g., Video, Image, Demo Link"
                    value={asset.asset_type}
                    onChange={(e) => updateAsset(index, "asset_type", e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`asset-name-${index}`} className="text-xs">Asset Name</Label>
                  <Input
                    id={`asset-name-${index}`}
                    placeholder="Asset name"
                    value={asset.asset_name}
                    onChange={(e) => updateAsset(index, "asset_name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`asset-link-${index}`} className="text-xs">Link</Label>
                  <Input
                    id={`asset-link-${index}`}
                    placeholder="https://..."
                    value={asset.link}
                    onChange={(e) => updateAsset(index, "link", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
