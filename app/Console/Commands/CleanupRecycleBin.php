<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\Party;
use App\Models\Product;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Console\Command;

class CleanupRecycleBin extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'recycle-bin:cleanup {--days=60 : Number of days before permanent deletion}';

    /**
     * The console command description.
     */
    protected $description = 'Permanently delete items that have been in the recycle bin for more than 60 days';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $days = (int) $this->option('days');
        $cutoffDate = Carbon::now()->subDays($days);

        $this->info("Cleaning up items deleted before {$cutoffDate->toDateString()}...");

        // Clean up products
        $productsDeleted = Product::onlyTrashed()
            ->where('deleted_at', '<', $cutoffDate)
            ->count();
        Product::onlyTrashed()
            ->where('deleted_at', '<', $cutoffDate)
            ->forceDelete();
        $this->line("- Products: {$productsDeleted} permanently deleted");

        // Clean up transactions
        $transactionsDeleted = Transaction::onlyTrashed()
            ->where('deleted_at', '<', $cutoffDate)
            ->count();
        Transaction::onlyTrashed()
            ->where('deleted_at', '<', $cutoffDate)
            ->forceDelete();
        $this->line("- Transactions: {$transactionsDeleted} permanently deleted");

        // Clean up parties
        $partiesDeleted = Party::onlyTrashed()
            ->where('deleted_at', '<', $cutoffDate)
            ->count();
        Party::onlyTrashed()
            ->where('deleted_at', '<', $cutoffDate)
            ->forceDelete();
        $this->line("- Parties: {$partiesDeleted} permanently deleted");

        // Clean up invoices
        $invoicesDeleted = Invoice::onlyTrashed()
            ->where('deleted_at', '<', $cutoffDate)
            ->count();
        Invoice::onlyTrashed()
            ->where('deleted_at', '<', $cutoffDate)
            ->forceDelete();
        $this->line("- Invoices: {$invoicesDeleted} permanently deleted");

        $total = $productsDeleted + $transactionsDeleted + $partiesDeleted + $invoicesDeleted;
        $this->info("Total: {$total} items permanently deleted from recycle bin.");

        return Command::SUCCESS;
    }
}
