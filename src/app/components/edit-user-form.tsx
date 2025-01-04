"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2 } from 'lucide-react'
import { endpoints } from "@/app/api/config"
import { User } from "@/lib/types"

const formSchema = z.object({
  defaultTablespace: z.string().optional(),
  temporaryTablespace: z.string().optional(),
  quotaLimit: z.string().optional(),
  accountLocked: z.boolean(),
  passwordExpiryDate: z.string().optional(),
})

interface EditUserFormProps {
  user: User
  onSuccess: () => void
}

export function EditUserForm({ user, onSuccess }: EditUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      defaultTablespace: user.defaultTablespace || "",
      temporaryTablespace: user.temporaryTablespace || "",
      quotaLimit: user.quotaLimit || "",
      accountLocked: user.accountLocked,
      passwordExpiryDate: user.passwordExpiryDate ? new Date(user.passwordExpiryDate[0], user.passwordExpiryDate[1] - 1, user.passwordExpiryDate[2]).toISOString().split('T')[0] : undefined,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      const response = await fetch(`${endpoints.users}/${user.username}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error("Failed to update user")
      }

      toast.success("User updated successfully")
      onSuccess()
    } catch (error) {
      toast.error("Failed to update user. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="defaultTablespace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Tablespace</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The default tablespace for the user
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="temporaryTablespace"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Temporary Tablespace</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The temporary tablespace for the user
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="quotaLimit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quota Limit</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The quota limit for the user (e.g., 5M, 100M, UNLIMITED)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountLocked"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Account Locked</FormLabel>
                <FormDescription>
                  Toggle to lock or unlock the account
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="passwordExpiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Expiry Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormDescription>
                Set the date when the password will expire
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update User
          </Button>
        </div>
      </form>
    </Form>
  )
}
