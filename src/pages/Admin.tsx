import { FormEvent, useMemo, useRef, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts, type ManagedProduct } from "@/hooks/useProducts";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { PromotionsPanel } from "@/components/admin/PromotionsPanel";
import { apiUploadImage } from "@/lib/api";
import {
  ArrowLeft,
  CloudUpload,
  Database,
  Flame,
  LayoutGrid,
  Loader2,
  LogOut,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const emptyDraft: Omit<ManagedProduct, "id"> = {
  name: "",
  category: "",
  description: "",
  price: 0,
  image: "",
  promo: false,
  discount: 0,
  promoTag: "",
};

// Redimensiona e comprime qualquer imagem (sem limite de tamanho de entrada)
const compressImage = (file: File, maxSide = 1600, quality = 0.85): Promise<string> =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas"));
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("load"));
    };
    img.src = url;
  });

const ProductForm = ({
  initial,
  onSubmit,
  submitLabel,
  categories,
}: {
  initial: Omit<ManagedProduct, "id">;
  onSubmit: (data: Omit<ManagedProduct, "id">) => void;
  submitLabel: string;
  categories: string[];
}) => {
  const [draft, setDraft] = useState<Omit<ManagedProduct, "id">>(initial);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const { apiOn } = useProducts();

  const handleFile = async (file: File) => {
    if (apiOn) {
      // Banco conectado: envia a imagem para o servidor (sem limite de tamanho)
      setUploading(true);
      try {
        const url = await apiUploadImage(file);
        setDraft((d) => ({ ...d, image: url }));
        toast.success("Imagem enviada para o servidor");
      } catch (err) {
        toast.error("Falha no upload", {
          description: err instanceof Error ? err.message : "Tente novamente",
        });
      } finally {
        setUploading(false);
      }
      return;
    }
    // Modo local: aceita qualquer tamanho e otimiza automaticamente
    setUploading(true);
    try {
      const dataUrl = await compressImage(file);
      setDraft((d) => ({ ...d, image: dataUrl }));
      toast.success("Imagem carregada e otimizada");
    } catch {
      toast.error("Não foi possível ler a imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!draft.name.trim()) return toast.error("Informe o nome do produto");
    if (!draft.category.trim()) return toast.error("Informe a categoria");
    if (!draft.image.trim()) return toast.error("Adicione uma imagem (upload ou URL)");
    if (draft.price <= 0) return toast.error("Preço deve ser maior que zero");
    if (draft.promo && (draft.discount ?? 0) <= 0) {
      return toast.error("Em promoção, informe um desconto > 0%");
    }
    onSubmit({ ...draft, name: draft.name.trim(), category: draft.category.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Nome do produto *</Label>
          <Input
            id="name"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            placeholder="Ex: Capinha Transparente iPhone 15"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Categoria *</Label>
          <Input
            id="category"
            value={draft.category}
            onChange={(e) => setDraft({ ...draft, category: e.target.value })}
            placeholder="Ex: Capinhas, Áudio, Copos..."
            list="cat-suggestions"
          />
          <datalist id="cat-suggestions">
            {categories.filter((c) => c !== "Todos").map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Preço (R$) *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={draft.price || ""}
            onChange={(e) => setDraft({ ...draft, price: parseFloat(e.target.value) || 0 })}
            placeholder="0,00"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Descreva o produto..."
            rows={3}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Imagem *</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={draft.image.startsWith("data:") ? "" : draft.image}
              onChange={(e) => setDraft({ ...draft, image: e.target.value })}
              placeholder="Cole uma URL da imagem ou faça upload"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {uploading ? "Enviando..." : "Upload"}
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = "";
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {apiOn
              ? "Banco conectado: imagens salvas no servidor, sem limite de tamanho."
              : "Modo local: imagens de até ~1.5 MB."}
          </p>
          {draft.image && (
            <div className="mt-2 h-32 w-32 rounded-lg overflow-hidden border border-border bg-muted">
              <img src={draft.image} alt="Pré-visualização" className="h-full w-full object-cover" />
            </div>
          )}
        </div>

        <div className="sm:col-span-2 rounded-xl border border-border bg-muted/40 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-primary" />
              <Label htmlFor="promo" className="font-bold cursor-pointer">
                Produto em promoção
              </Label>
            </div>
            <Switch
              id="promo"
              checked={!!draft.promo}
              onCheckedChange={(v) => setDraft({ ...draft, promo: v })}
            />
          </div>

          {draft.promo && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Desconto (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  min="0"
                  max="99"
                  value={draft.discount || ""}
                  onChange={(e) =>
                    setDraft({ ...draft, discount: parseInt(e.target.value) || 0 })
                  }
                  placeholder="Ex: 20"
                />
                {(draft.discount ?? 0) > 0 && draft.price > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Preço final:{" "}
                    <span className="font-bold text-primary">
                      {formatPrice(draft.price * (1 - (draft.discount ?? 0) / 100))}
                    </span>
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="promoTag">Etiqueta (opcional)</Label>
                <Input
                  id="promoTag"
                  value={draft.promoTag || ""}
                  onChange={(e) => setDraft({ ...draft, promoTag: e.target.value })}
                  placeholder="Ex: OFERTA RELÂMPAGO"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button type="submit" variant="hero">
          {submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
};

const AdminInner = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct, resetToDefaults, effectivePrice, apiOn, serverEmpty, syncToServer } =
    useProducts();
  const { logout } = useAdminAuth();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<ManagedProduct | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (categoryFilter !== "Todos" && p.category !== categoryFilter) return false;
      if (q && !p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q))
        return false;
      return true;
    });
  }, [products, search, categoryFilter]);

  const stats = useMemo(
    () => ({
      total: products.length,
      promos: products.filter((p) => p.promo).length,
      categories: new Set(products.map((p) => p.category)).size,
    }),
    [products],
  );

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="container flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-muted-foreground hover:text-primary transition-smooth">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-extrabold text-lg leading-none">Painel Admin</h1>
              <p className="text-xs text-muted-foreground">SmartCell — Gestão de produtos</p>
            </div>
            <Badge
              variant="outline"
              className={
                apiOn
                  ? "gap-1.5 border-green-500/40 text-green-600"
                  : "gap-1.5 border-amber-500/40 text-amber-600"
              }
              title={
                apiOn
                  ? "Produtos e imagens salvos no banco de dados da hospedagem"
                  : "Banco não configurado — alterações ficam só neste navegador"
              }
            >
              <Database className="h-3 w-3" />
              {apiOn ? "Banco conectado" : "Modo local"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {apiOn && serverEmpty && (
              <Button
                variant="hero"
                size="sm"
                onClick={async () => {
                  try {
                    await syncToServer();
                    toast.success("Catálogo enviado para o servidor");
                  } catch {
                    toast.error("Falha ao sincronizar", {
                      description: "Verifique a configuração do banco.",
                    });
                  }
                }}
              >
                <CloudUpload className="h-4 w-4" />
                <span className="hidden sm:inline">Enviar catálogo ao servidor</span>
              </Button>
            )}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4" />
                  <span className="hidden sm:inline">Restaurar padrão</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Restaurar produtos padrão?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso vai apagar todas as suas alterações e voltar para o catálogo inicial.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      resetToDefaults();
                      toast.success("Catálogo restaurado");
                    }}
                  >
                    Restaurar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout();
                toast.success("Sessão encerrada");
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                Total de produtos
              </p>
              <p className="mt-2 text-3xl font-extrabold">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold flex items-center gap-1.5">
                <Flame className="h-3.5 w-3.5 text-primary" /> Em promoção
              </p>
              <p className="mt-2 text-3xl font-extrabold text-primary">{stats.promos}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">
                Categorias
              </p>
              <p className="mt-2 text-3xl font-extrabold">{stats.categories}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList>
            <TabsTrigger value="products" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Produtos
            </TabsTrigger>
            <TabsTrigger value="promos" className="gap-2">
              <Flame className="h-4 w-4" />
              Promoções
              {stats.promos > 0 && (
                <Badge className="ml-1 bg-primary text-primary-foreground hover:bg-primary px-1.5 py-0 text-[10px]">
                  {stats.promos}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6 mt-0">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar produto..."
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((c) => (
                  <Button
                    key={c}
                    size="sm"
                    variant={categoryFilter === c ? "default" : "outline"}
                    onClick={() => setCategoryFilter(c)}
                    className="rounded-full shrink-0"
                  >
                    {c}
                  </Button>
                ))}
              </div>
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button variant="hero">
                    <Plus className="h-4 w-4" />
                    Novo produto
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar novo produto</DialogTitle>
                  </DialogHeader>
                  <ProductForm
                    initial={emptyDraft}
                    submitLabel="Criar produto"
                    categories={categories}
                    onSubmit={(data) => {
                      addProduct(data);
                      setCreateOpen(false);
                      toast.success("Produto criado", { description: data.name });
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Table */}
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Imagem</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Promoção</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                            Nenhum produto encontrado.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filtered.map((p) => {
                          const finalPrice = effectivePrice(p);
                          return (
                            <TableRow key={p.id}>
                              <TableCell>
                                <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                                  <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <p className="font-semibold line-clamp-1">{p.name}</p>
                                <p className="text-xs text-muted-foreground line-clamp-1">
                                  {p.description}
                                </p>
                              </TableCell>
                              <TableCell>
                                <Badge variant="secondary">{p.category}</Badge>
                              </TableCell>
                              <TableCell>
                                {p.promo && p.discount ? (
                                  <div className="space-y-0.5">
                                    <p className="text-sm line-through text-muted-foreground">
                                      {formatPrice(p.price)}
                                    </p>
                                    <p className="font-bold text-primary">{formatPrice(finalPrice)}</p>
                                  </div>
                                ) : (
                                  <p className="font-semibold">{formatPrice(p.price)}</p>
                                )}
                              </TableCell>
                              <TableCell>
                                {p.promo ? (
                                  <Badge className="bg-primary text-primary-foreground hover:bg-primary">
                                    <Flame className="h-3 w-3 mr-1" />
                                    {p.discount}% OFF
                                  </Badge>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setEditing(p)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="icon" variant="ghost" className="text-destructive">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Esta ação remove <strong>{p.name}</strong> do catálogo.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => {
                                            deleteProduct(p.id);
                                            toast.success("Produto excluído");
                                          }}
                                        >
                                          Excluir
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="promos" className="mt-0">
            <PromotionsPanel />
          </TabsContent>
        </Tabs>
      </main>

      {/* Edit dialog */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar produto</DialogTitle>
          </DialogHeader>
          {editing && (
            <ProductForm
              initial={editing}
              submitLabel="Salvar alterações"
              categories={categories}
              onSubmit={(data) => {
                updateProduct(editing.id, data);
                setEditing(null);
                toast.success("Produto atualizado");
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Admin = () => {
  const { authed } = useAdminAuth();
  if (!authed) return <Navigate to="/admin/login" replace />;
  return <AdminInner />;
};

export default Admin;
