"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { db } from "@/firebaseConfig"
import { doc, setDoc } from "firebase/firestore"

// Constants
const BODY_PARTS = [
  { id: "leftArm", label: "Left Arm" },
  { id: "rightArm", label: "Right Arm" },
  { id: "chest", label: "Chest" },
  { id: "waistLine", label: "WaistLine" },
  { id: "hips", label: "Hips" },
  { id: "glutes", label: "Glutes" },
  { id: "leftThigh", label: "Left Thigh" },
  { id: "rightThigh", label: "Right Thigh" },
  { id: "shoulders", label: "Shoulders" },
  { id: "leftForearm", label: "Left Forearm" },
  { id: "rightForearm", label: "Right Forearm" },
]

const GOAL_OPTIONS = [
  { value: "10", label: "+10% (Increase)" },
  { value: "5", label: "+5% (Increase)" },
  { value: "0", label: "0% (No Change)" },
  { value: "-5", label: "-5% (Decrease)" },
  { value: "-10", label: "-10% (Decrease)" },
]

const MONTHS = [
  "October 2024",
  "November 2024",
  "December 2024",
  "January 2025",
  "February 2025",
  "March 2025",
  "April 2025",
]

// Helper Functions
const calculateGoal = (baseline, percentage) => {
  const baselineNum = parseFloat(baseline) || 0
  const percentageNum = parseFloat(percentage) || 0
  const change = baselineNum * (percentageNum / 100)
  return (baselineNum + change).toFixed(1)
}

export default function Register() {
  // Hooks
  const { data: session, status } = useSession()
  const router = useRouter()

  // State
  const [formData, setFormData] = useState({
    displayName: "",
    selectedParts: [],
    measurements: {},
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Effects
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  // Event Handlers
  const handleBodyPartSelection = (partId) => {
    setFormData((prev) => {
      const currentSelected = prev.selectedParts || []
      let newSelected

      if (currentSelected.includes(partId)) {
        newSelected = currentSelected.filter((id) => id !== partId)
      } else if (currentSelected.length < 4) {
        newSelected = [...currentSelected, partId]
      } else {
        return prev
      }

      const newMeasurements = {}
      newSelected.forEach((id) => {
        newMeasurements[id] = {
          baseline: prev.measurements[id]?.baseline || "",
          goalPercentage: prev.measurements[id]?.goalPercentage || "0",
          monthlyProgress: MONTHS.reduce((acc, month) => {
            acc[month] = ""
            return acc
          }, {}),
        }
      })

      return {
        ...prev,
        selectedParts: newSelected,
        measurements: newMeasurements,
      }
    })
  }

  const handleMeasurementChange = (bodyPart, field, value) => {
    setFormData((prev) => ({
      ...prev,
      measurements: {
        ...prev.measurements,
        [bodyPart]: {
          ...prev.measurements[bodyPart],
          [field]: value,
        },
      },
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!session?.user?.email || formData.selectedParts.length !== 4) return

    setLoading(true)
    setError("")

    try {
      const userRef = doc(db, "users", session.user.email)
      const measurementRef = doc(db, "measurements", session.user.email)

      // Save user data
      await setDoc(userRef, {
        displayName: formData.displayName || session.user.email.split("@")[0],
        email: session.user.email,
        selectedParts: formData.selectedParts,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      // Save measurements
      await setDoc(measurementRef, {
        ...formData.measurements,
        lastUpdated: new Date().toISOString(),
      })

      router.push("/dashboard")
    } catch (error) {
      console.error("Registration error:", error)
      setError("Failed to save your data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Loading and Auth States
  if (status === "loading") {
    return <div className="text-center mt-8">Loading...</div>
  }

  if (!session) {
    return <div className="text-center mt-8">Please sign in to continue</div>
  }

  // Render Components
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Complete Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Display Name Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, displayName: e.target.value }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your display name"
          />
        </div>

        {/* Body Part Selection */}
        <div>
          <h2 className="text-lg font-semibold mb-2">
            Select 4 Body Parts to Track
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Choose exactly 4 body parts you want to track during the challenge.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {BODY_PARTS.map((part) => (
              <button
                key={part.id}
                type="button"
                onClick={() => handleBodyPartSelection(part.id)}
                className={`p-3 rounded-lg text-center transition-colors ${
                  formData.selectedParts?.includes(part.id)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                } ${
                  formData.selectedParts?.length >= 4 &&
                  !formData.selectedParts?.includes(part.id)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {part.label}
              </button>
            ))}
          </div>
        </div>

        {/* Measurements Table */}
        {formData.selectedParts?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Body Part
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Baseline (inches)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Goal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Target (inches)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {formData.selectedParts.map((partId) => {
                  const part = BODY_PARTS.find((p) => p.id === partId)
                  const baseline = formData.measurements[partId]?.baseline || ""
                  const goalPercentage =
                    formData.measurements[partId]?.goalPercentage || "0"

                  return (
                    <tr key={partId}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {part.label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="number"
                          step="0.1"
                          value={baseline}
                          onChange={(e) =>
                            handleMeasurementChange(
                              partId,
                              "baseline",
                              e.target.value
                            )
                          }
                          required
                          className="w-24 px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={goalPercentage}
                          onChange={(e) =>
                            handleMeasurementChange(
                              partId,
                              "goalPercentage",
                              e.target.value
                            )
                          }
                          required
                          className="w-40 px-2 py-1 border rounded"
                        >
                          {GOAL_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {calculateGoal(baseline, goalPercentage)} inches
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm text-center">{error}</div>
        )}

        <button
          type="submit"
          disabled={loading || formData.selectedParts?.length !== 4}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Complete Registration"}
        </button>

        {formData.selectedParts?.length !== 4 && (
          <p className="text-sm text-red-500 text-center">
            Please select exactly 4 body parts to continue
          </p>
        )}
      </form>
    </div>
  )
}
