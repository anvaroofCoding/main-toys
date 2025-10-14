import NewProducts from "@/components/newProducts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useAddCommentMutation,
  useAddQuantityMutation,
  useGetCardProductsQuery,
  useGetCommentQuery,
  useProductsDetailQuery,
} from "@/service/api";
import {
  ArrowLeft,
  Loader2,
  Minus,
  Plus,
  Send,
  ShoppingCart,
  Star,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, Toaster } from "sonner";

export default function ProductDetails() {
  const { id } = useParams();

  const {
    data: product,
    isLoading,
    isFetching,
    error,
  } = useProductsDetailQuery(id);
  const [addProducts, { isLoading: adding }] = useAddQuantityMutation();
  const [addCommentm, { isLoading: comLoad }] = useAddCommentMutation();
  const { data: comments, isLoading: comLoads } = useGetCommentQuery(id);
  const { data: getCard, isLoading: getCardLoad } = useGetCardProductsQuery();

  // UI state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [count, setCount] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [imgs, setImgs] = useState(null);

  useEffect(() => {
    if (product) {
      setSelectedImageIndex(0);
      setSelectedColor(product.colors?.[0]?.color ?? null);
      setCount(1);
      setImgs(product.colors?.[0]?.images[0] ?? null);
    }
  }, [product]);

  const allImages = useMemo(() => {
    if (!product?.colors) return [];
    const images = [];
    product.colors.forEach((colorObj) => {
      colorObj.images.forEach((imageUrl) => {
        images.push({
          url: imageUrl,
          color: colorObj.color,
          colorId: colorObj.id,
          quantity: colorObj.quantity,
        });
      });
    });
    return images;
  }, [product]);

  const colorOptions = useMemo(() => {
    if (!product?.colors) return [];
    return product.colors.map((colorObj) => ({
      id: colorObj?.id,
      color: colorObj?.color,
      image: colorObj?.images[0],
      quantity: colorObj.quantity,
    }));
  }, [product]);

  const displayedImage = allImages[selectedImageIndex]?.url;

  const handleSelectColor = (color) => {
    setSelectedColor(color.color);
    setImgs(color.image);
    const idx = allImages.findIndex((img) => img.color === color.color);
    if (idx >= 0) setSelectedImageIndex(idx);
  };

  const handleDecrease = () => setCount((prev) => Math.max(1, prev - 1));
  const handleIncrease = () => {
    const selectedColorObj = product.colors?.find(
      (c) => c.color === selectedColor
    );
    const maxQuantity = selectedColorObj?.quantity || 9999;

    setCount((prev) => {
      if (prev < maxQuantity) return prev + 1;
      toast.warning("Bu rangdagi mahsulot soni tugagan!");
      return prev;
    });
  };

  const Naveg = () => {
    window.location.href = "/buyurtmalar";
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      const findedShops = product.colors.find((c) => c.color === selectedColor);
      setImgs(findedShops?.images[0]);
      if (findedShops?.quantity == 0) {
        toast.error(
          `Tanlangan rangdagi mahsulot boshqa qolmagan! (${findedShops?.quantity} dona)`
        );
      } else if (count > findedShops?.quantity) {
        toast.error(
          `Tanlangan rangdagi mahsulot boshqa qolmagan! (${findedShops?.quantity} dona)`
        );
      } else {
        const payload = {
          product_id: product.id,
          quantity: count,
          color: selectedColor,
        };
        await addProducts(payload).unwrap();
        toast.success("Mahsulot savatga qo`shildi");
      }
    } catch (err) {
      toast.error(`Mahsulotni qo'shishda xatolik yuz berdi: ${err}`);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      toast.error("Iltimos, fikringizni yozing");
      return;
    }

    try {
      const payload = {
        product_id: Number(id),
        comment: commentText,
        rating: selectedRating,
      };
      await addCommentm(payload).unwrap();
      toast.success("Fikringiz muvaffaqiyatli qo'shildi!");
      setCommentText("");
      setSelectedRating(5);
    } catch (err) {
      toast.error("Fikr qo'shishda xatolik yuz berdi");
      console.log(err);
    }
  };

  if (isLoading || isFetching || comLoads || getCardLoad)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen p-6">
        <Card className="p-6 max-w-md text-center">
          <p className="text-destructive font-medium">
            Mahsulotni yuklashda xatolik yuz berdi.
          </p>
        </Card>
      </div>
    );

  if (!product) return null;

  const avgRating = Number.parseFloat(product.average_rating || "0");
  const findProd = getCard?.find((it) => it.product_id === product.id);
  const findedOrders = findProd?.images?.find((cen) => cen === imgs);
  return (
    <div className="min-h-screen bg-background pb-20">
      <Toaster position="top-center" richColors />

      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/barcha-maxsulotlar">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-blue-500/10"
            >
              <ArrowLeft className="h-5 w-5 text-blue-500" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-4">
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative h-80 aspect-square bg-muted/30">
                {product.video_url ? (
                  <video controls className="w-full h-full object-contain">
                    <source src={product.video_url} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={displayedImage || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain p-8 "
                  />
                )}

                {allImages.length > 1 && (
                  <>
                    <Button
                      onClick={() =>
                        setSelectedImageIndex((i) => Math.max(0, i - 1))
                      }
                      disabled={selectedImageIndex === 0}
                      variant="secondary"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg disabled:opacity-30"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() =>
                        setSelectedImageIndex((i) =>
                          Math.min(allImages.length - 1, i + 1)
                        )
                      }
                      disabled={selectedImageIndex === allImages.length - 1}
                      variant="secondary"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full shadow-lg disabled:opacity-30"
                    >
                      <ArrowLeft className="h-4 w-4 rotate-180" />
                    </Button>
                  </>
                )}

                {allImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {allImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`h-2 rounded-full transition-all ${
                          idx === selectedImageIndex
                            ? "w-8 bg-blue-500"
                            : "w-2 bg-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {allImages.length > 1 && (
              <div className="hidden sm:grid grid-cols-5 gap-3">
                {allImages.slice(0, 5).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === idx
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-transparent hover:border-muted-foreground/20"
                    }`}
                  >
                    <img
                      src={img.url || "/placeholder.svg"}
                      alt={img.color}
                      className="w-full h-full object-contain p-2 bg-muted/30"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-blue-500 uppercase tracking-wide">
                {product.category}
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-4 pb-6 border-b">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <svg
                    key={i}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill={i <= Math.round(avgRating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className={`${
                      i <= Math.round(avgRating)
                        ? "text-yellow-500"
                        : "text-muted-foreground/30"
                    }`}
                  >
                    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.168L12 18.896 4.664 23.166l1.402-8.168L0.132 9.209l8.2-1.192z" />
                  </svg>
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {product.average_rating}
                </span>{" "}
                · {product.sold_count} sotilgan
              </div>
            </div>

            <div className="flex items-baseline gap-3 py-2">
              {product.discount > 0 ? (
                <>
                  <span className="text-4xl font-bold tracking-tight">
                    {Number(product.discounted_price).toLocaleString("uz-UZ")}{" "}
                    so'm
                  </span>
                  <span className="text-xl line-through text-muted-foreground">
                    {Number(product.price).toLocaleString("uz-UZ")}
                  </span>
                  <span className="px-2.5 py-1 bg-red-500/10 text-red-600 text-sm font-semibold rounded-full">
                    -{product.discount}%
                  </span>
                </>
              ) : (
                <span className="text-4xl font-bold tracking-tight">
                  {Number(product.price).toLocaleString("uz-UZ")} so'm
                </span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            <div className="space-y-3 py-4">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Rangini tanlang
              </h4>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((colorObj) => (
                  <button
                    key={colorObj.id}
                    onClick={() => handleSelectColor(colorObj)}
                    className={`group relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all hover:shadow-md ${
                      selectedColor === colorObj.color
                        ? "border-blue-500 bg-blue-500/5 shadow-md"
                        : "border-border hover:border-blue-500/50"
                    }`}
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted/30 flex items-center justify-center">
                      <img
                        src={colorObj.image || "/placeholder.svg"}
                        alt={colorObj.color}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="text-center">
                      <span className="text-sm font-medium block">
                        {colorObj.color}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {colorObj.quantity} dona
                      </span>
                    </div>
                    {selectedColor === colorObj.color && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 ">
              <div className="flex items-center justify-center rounded-xl border-2 border-border overflow-hidden bg-muted/30">
                <Button
                  onClick={handleDecrease}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-none hover:bg-blue-500/10 hover:text-blue-500 disabled:opacity-30"
                >
                  <Minus className="h-5 w-5" />
                </Button>

                <div className="px-6 min-w-[80px] text-center font-bold text-xl select-none">
                  {count}
                </div>

                <Button
                  onClick={handleIncrease}
                  variant="ghost"
                  size="icon"
                  className="h-14 w-14 rounded-none hover:bg-blue-500/10 hover:text-blue-500 disabled:opacity-30"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>

              <div className="text-white flex-1 w-full">
                {findedOrders ? (
                  <Button
                    onClick={Naveg}
                    className="w-full h-14 bg-orange-700 hover:bg-orange-600 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-60 py-4 duration-200"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Savatga o'tish
                  </Button>
                ) : (
                  <Button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="w-full h-14 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-base rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30 disabled:opacity-60 py-4"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {adding ? "Qo`shilmoqda..." : "Savatga qo`shish"}
                  </Button>
                )}
              </div>
            </div>

            <div className="pt-8 space-y-4">
              <Card className="p-6 space-y-4 bg-muted/30">
                <h4 className="font-semibold">Fikr qoldiring</h4>

                <div className="space-y-4">
                  <label className="text-sm font-medium">Baho qo'ying</label>
                  <div className="flex items-center gap-2 py-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className="transition-transform hover:scale-110"
                      >
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill={
                            rating <= selectedRating ? "currentColor" : "none"
                          }
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`${
                            rating <= selectedRating
                              ? "text-yellow-500"
                              : "text-muted-foreground/30"
                          }`}
                        >
                          <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.168L12 18.896 4.664 23.166l1.402-8.168L0.132 9.209l8.2-1.192z" />
                        </svg>
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-medium">
                      {selectedRating} yulduz
                    </span>
                  </div>
                </div>

                <div className="space-y-5">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Mahsulot haqida fikringizni yozing..."
                    className="w-full min-h-[100px] mt-3 p-3 rounded-lg border-2 border-border bg-background focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                <div className="text-white">
                  <Button
                    onClick={handleSubmitComment}
                    disabled={comLoad || !commentText.trim()}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex items-center justify-center gap-2 disabled:opacity-60 transition-all duration-200"
                  >
                    {comLoad ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Yuborilmoqda...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Fikr yuborish</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card>
              {comments.map((comment) => (
                <Card
                  key={comment.id}
                  className="p-4 hover:shadow-md transition-shadow duration-200"
                >
                  {/* Yuqori qism: ism, baho, sana */}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {comment.first_name || "Foydalanuvchi"}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {new Date(comment.created_at).toLocaleDateString(
                          "uz-UZ",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    {/* Yulduzli baho */}
                    <div className="flex items-center gap-1 text-sm font-medium">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < comment.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Fikr matni */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {comment.text}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="my-10">
        <NewProducts />
      </div>
    </div>
  );
}
