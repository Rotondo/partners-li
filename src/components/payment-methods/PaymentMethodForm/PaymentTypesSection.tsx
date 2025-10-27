import { UseFormReturn } from "react-hook-form";
import { PaymentMethodFormData } from "@/lib/payment-method-schema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { CARD_BRANDS, DIGITAL_WALLETS } from "@/types/payment-method";

interface PaymentTypesSectionProps {
  form: UseFormReturn<PaymentMethodFormData>;
}

export function PaymentTypesSection({ form }: PaymentTypesSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
          <span className="text-destructive">🔴</span>
          Meios de Pagamento Aceitos
        </h3>
        <p className="text-sm text-muted-foreground">Campos obrigatórios</p>
      </div>

      {/* Cartão de Crédito */}
      <div className="space-y-3 p-4 border rounded-lg">
        <FormField
          control={form.control}
          name="acceptedPaymentMethods.creditCard.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Cartão de Crédito</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        {form.watch("acceptedPaymentMethods.creditCard.enabled") && (
          <FormField
            control={form.control}
            name="acceptedPaymentMethods.creditCard.brands"
            render={() => (
              <FormItem>
                <FormLabel>Bandeiras Aceitas</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CARD_BRANDS.map((brand) => (
                    <FormField
                      key={brand}
                      control={form.control}
                      name="acceptedPaymentMethods.creditCard.brands"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(brand)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                return checked
                                  ? field.onChange([...current, brand])
                                  : field.onChange(current.filter((value) => value !== brand));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{brand}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Cartão de Débito */}
      <div className="space-y-3 p-4 border rounded-lg">
        <FormField
          control={form.control}
          name="acceptedPaymentMethods.debitCard.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Cartão de Débito</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        {form.watch("acceptedPaymentMethods.debitCard.enabled") && (
          <FormField
            control={form.control}
            name="acceptedPaymentMethods.debitCard.brands"
            render={() => (
              <FormItem>
                <FormLabel>Bandeiras Aceitas</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {CARD_BRANDS.map((brand) => (
                    <FormField
                      key={brand}
                      control={form.control}
                      name="acceptedPaymentMethods.debitCard.brands"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(brand)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                return checked
                                  ? field.onChange([...current, brand])
                                  : field.onChange(current.filter((value) => value !== brand));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{brand}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* Pix */}
      <div className="space-y-3 p-4 border rounded-lg">
        <FormField
          control={form.control}
          name="acceptedPaymentMethods.pix.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Pix</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        {form.watch("acceptedPaymentMethods.pix.enabled") && (
          <div className="ml-6 space-y-2">
            <FormField
              control={form.control}
              name="acceptedPaymentMethods.pix.normal"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Pix Normal</FormLabel>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="acceptedPaymentMethods.pix.installment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Pix Parcelado</FormLabel>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Boleto */}
      <div className="p-4 border rounded-lg">
        <FormField
          control={form.control}
          name="acceptedPaymentMethods.boleto"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Boleto</FormLabel>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* Carteira Digital */}
      <div className="space-y-3 p-4 border rounded-lg">
        <FormField
          control={form.control}
          name="acceptedPaymentMethods.digitalWallet.enabled"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Carteira Digital</FormLabel>
              </div>
            </FormItem>
          )}
        />
        
        {form.watch("acceptedPaymentMethods.digitalWallet.enabled") && (
          <FormField
            control={form.control}
            name="acceptedPaymentMethods.digitalWallet.wallets"
            render={() => (
              <FormItem>
                <FormLabel>Carteiras Aceitas</FormLabel>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {DIGITAL_WALLETS.map((wallet) => (
                    <FormField
                      key={wallet}
                      control={form.control}
                      name="acceptedPaymentMethods.digitalWallet.wallets"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(wallet)}
                              onCheckedChange={(checked) => {
                                const current = field.value || [];
                                return checked
                                  ? field.onChange([...current, wallet])
                                  : field.onChange(current.filter((value) => value !== wallet));
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">{wallet}</FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      {/* BNPL */}
      <div className="p-4 border rounded-lg">
        <FormField
          control={form.control}
          name="acceptedPaymentMethods.bnpl"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>BNPL (Buy Now, Pay Later)</FormLabel>
                <FormDescription>Crédito direto ao consumidor</FormDescription>
              </div>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
