"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Building, Phone, MapPin, Upload, Save } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Advogado Demo",
    email: "advogado@exemplo.com",
    company: "Escritório de Advocacia Demo",
    phone: "(11) 98765-4321",
    location: "São Paulo, SP",
    bio: "Advogado especializado em direito penal e civil com mais de 10 anos de experiência. Atuo principalmente em casos complexos que exigem estratégias inovadoras.",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Aqui você implementaria a lógica para salvar as alterações
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <User className="h-8 w-8 text-purple-500" />
        <h1 className="text-3xl font-bold text-white">Perfil</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="bg-slate-800/70 border-gray-700">
            <CardHeader className="pb-4">
              <CardTitle className="text-white">Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src="/placeholder.svg?height=128&width=128" alt="Avatar" />
                <AvatarFallback className="text-3xl bg-gradient-to-r from-purple-500 to-indigo-600">AD</AvatarFallback>
              </Avatar>

              <Button variant="outline" className="w-full border-gray-700 text-gray-300">
                <Upload className="h-4 w-4 mr-2" />
                Alterar Foto
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="bg-slate-800/70 border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-white">Informações Pessoais</CardTitle>
                  <CardDescription className="text-gray-400">Atualize suas informações de perfil</CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    className="border-gray-700 text-gray-300"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Nome Completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10 bg-slate-900/50 border-gray-700 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={profile.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10 bg-slate-900/50 border-gray-700 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-white">
                    Escritório/Empresa
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      name="company"
                      value={profile.company}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="pl-10 bg-slate-900/50 border-gray-700 focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      Telefone
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10 bg-slate-900/50 border-gray-700 focus:border-purple-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-white">
                      Localização
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="location"
                        name="location"
                        value={profile.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="pl-10 bg-slate-900/50 border-gray-700 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">
                    Biografia
                  </Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="min-h-[100px] bg-slate-900/50 border-gray-700 focus:border-purple-500"
                  />
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-2">
                    <Button
                      variant="outline"
                      className="border-gray-700 text-gray-300"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Salvar Alterações
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

