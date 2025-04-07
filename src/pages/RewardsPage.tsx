
import React from "react";
import { useAppContext } from "@/context/AppContext";
import Header from "@/components/layout/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Lock, Check } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

const RewardsPage = () => {
  const { stats, rewards, purchaseRewardItem } = useAppContext();

  const handlePurchase = (rewardId: string) => {
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return;

    // Check if already purchased
    if (reward.purchased) {
      toast({
        title: "Already purchased",
        description: "You've already unlocked this reward",
      });
      return;
    }

    // Check if enough XP
    if (stats.xp < reward.xpCost) {
      toast({
        title: "Not enough XP",
        description: `You need ${reward.xpCost - stats.xp} more XP to unlock this reward`,
        variant: "destructive",
      });
      return;
    }

    // Check if enough gold (if required)
    if (reward.goldCost && stats.gold < reward.goldCost) {
      toast({
        title: "Not enough Gold",
        description: `You need ${reward.goldCost - stats.gold} more Gold to unlock this reward`,
        variant: "destructive",
      });
      return;
    }

    // Attempt to purchase
    const success = purchaseRewardItem(rewardId);
    
    if (success) {
      toast({
        title: "Reward unlocked!",
        description: `You've successfully unlocked "${reward.title}"`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      
      <main className="container px-4 py-6 md:py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Reward Shop</h1>
          <p className="mt-1 text-muted-foreground">
            Spend your XP and Gold to unlock rewards
          </p>
        </div>
        
        <div className="mb-6 grid grid-cols-2 gap-4 sm:flex sm:items-center sm:justify-start sm:space-x-6">
          <Card className="flex flex-col items-center p-4 text-center">
            <h2 className="text-sm font-medium text-muted-foreground">Available XP</h2>
            <p className="mt-1 text-2xl font-bold">{stats.xp}</p>
          </Card>
          
          <Card className="flex flex-col items-center p-4 text-center">
            <h2 className="text-sm font-medium text-muted-foreground">Available Gold</h2>
            <p className="mt-1 text-2xl font-bold">{stats.gold}</p>
          </Card>
        </div>
        
        {rewards.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed text-center text-muted-foreground">
            <ShoppingBag className="mb-2 h-8 w-8" />
            <h3 className="mb-1 font-semibold">No rewards available</h3>
            <p className="max-w-sm text-sm">
              Rewards will be added soon. Keep earning XP and Gold!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rewards.map(reward => {
              const canAffordXp = stats.xp >= reward.xpCost;
              const canAffordGold = !reward.goldCost || stats.gold >= reward.goldCost;
              const canPurchase = canAffordXp && canAffordGold && !reward.purchased;
              
              return (
                <Card 
                  key={reward.id} 
                  className={`transition-all ${
                    reward.purchased 
                      ? "border-green-500/30 bg-green-950/10" 
                      : canPurchase 
                        ? "hover:border-primary/50 hover:shadow-lg" 
                        : "opacity-80"
                  }`}
                >
                  <CardHeader>
                    <CardTitle>{reward.title}</CardTitle>
                    {reward.description && (
                      <CardDescription>{reward.description}</CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                          {reward.xpCost} XP
                        </div>
                        
                        {reward.goldCost && (
                          <div className="rounded-full bg-amber-500/10 px-3 py-1 text-sm font-medium text-amber-500">
                            {reward.goldCost} Gold
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    {reward.purchased ? (
                      <Button disabled className="w-full bg-green-600 hover:bg-green-700">
                        <Check className="mr-2 h-4 w-4" />
                        Unlocked
                      </Button>
                    ) : canPurchase ? (
                      <Button className="w-full" onClick={() => handlePurchase(reward.id)}>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        Unlock Reward
                      </Button>
                    ) : (
                      <Button disabled className="w-full">
                        <Lock className="mr-2 h-4 w-4" />
                        {!canAffordXp 
                          ? `Need ${reward.xpCost - stats.xp} more XP` 
                          : `Need ${(reward.goldCost || 0) - stats.gold} more Gold`}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default RewardsPage;
