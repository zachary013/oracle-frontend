"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useForm } from "react-hook-form"
import { endpoints } from "@/app/api/config"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface FormValues {
  privilegeType: "SYSTEM" | "OBJECT"
  privilegeName: string
  userName: string
  objectName?: string
  withAdminOption: boolean
}

interface GrantPrivilegeFormProps {
  onSuccess: () => void
}

export function GrantPrivilegeForm({ onSuccess }: GrantPrivilegeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    defaultValues: {
      privilegeType: "SYSTEM",
      privilegeName: "",
      userName: "",
      objectName: "",
      withAdminOption: false,
    }
  })

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true)
      const endpoint = values.privilegeType === "SYSTEM" 
        ? `${endpoints.privileges}/grant/system`
        : `${endpoints.privileges}/grant/object`

      const params = new URLSearchParams({
        privilegeName: values.privilegeName,
        userName: values.userName,
        ...(values.privilegeType === "SYSTEM" && {
          withAdminOption: values.withAdminOption.toString(),
        }),
        ...(values.privilegeType === "OBJECT" && {
          objectName: values.objectName || "",
        }),
      })

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      toast.success("Privilege granted successfully")
      onSuccess()
    } catch (error) {
      console.error("Failed to grant privilege:", error)
      toast.error("Failed to grant privilege")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="privilegeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Privilege Type</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select privilege type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SYSTEM">System</SelectItem>
                  <SelectItem value="OBJECT">Object</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privilegeName"
          rules={{ required: "Privilege name is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Privilege Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter privilege name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="userName"
          rules={{ required: "Username is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("privilegeType") === "OBJECT" && (
          <FormField
            control={form.control}
            name="objectName"
            rules={{ required: "Object name is required for object privileges" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Object Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter object name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("privilegeType") === "SYSTEM" && (
          <FormField
            control={form.control}
            name="withAdminOption"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Grant with admin option</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Grant Privilege
        </Button>
      </form>
    </Form>
  )
}