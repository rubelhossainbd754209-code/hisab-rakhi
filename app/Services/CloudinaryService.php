<?php

namespace App\Services;

use App\Models\CloudinaryAccount;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;

class CloudinaryService
{
    protected ?CloudinaryAccount $account = null;

    public function __construct()
    {
        $this->account = CloudinaryAccount::active()->first();
    }

    /**
     * Check if there's an active Cloudinary account
     */
    public function hasActiveAccount(): bool
    {
        return $this->account !== null;
    }

    /**
     * Get active account info (without sensitive data)
     */
    public function getActiveAccount(): ?array
    {
        if (!$this->account) {
            return null;
        }

        return [
            'id' => $this->account->id,
            'name' => $this->account->name,
            'cloud_name' => $this->account->cloud_name,
        ];
    }

    /**
     * Upload file to Cloudinary
     */
    public function upload(UploadedFile $file, string $folder = 'uploads'): array
    {
        if (!$this->account) {
            throw new \Exception('No active Cloudinary account configured.');
        }

        $timestamp = time();
        $filename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $filename = preg_replace('/[^a-zA-Z0-9_-]/', '_', $filename); // Sanitize filename
        $publicId = $filename . '_' . $timestamp;

        // Build signature - only include params that will be sent (excluding file and api_key)
        $params = [
            'folder' => $folder,
            'public_id' => $publicId,
            'timestamp' => $timestamp,
        ];
        
        ksort($params);
        
        // Create signature string: key1=value1&key2=value2{api_secret}
        $signatureParts = [];
        foreach ($params as $key => $value) {
            $signatureParts[] = $key . '=' . $value;
        }
        $signatureString = implode('&', $signatureParts) . $this->account->api_secret;
        $signature = sha1($signatureString);

        // Upload to Cloudinary using multipart form
        $response = Http::attach('file', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
            ->post("https://api.cloudinary.com/v1_1/{$this->account->cloud_name}/auto/upload", [
                'api_key' => $this->account->api_key,
                'timestamp' => $timestamp,
                'signature' => $signature,
                'public_id' => $publicId,
                'folder' => $folder,
            ]);

        if ($response->failed()) {
            throw new \Exception('Cloudinary upload failed: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Upload file from URL to Cloudinary
     */
    public function uploadFromUrl(string $url, string $folder = 'uploads'): array
    {
        if (!$this->account) {
            throw new \Exception('No active Cloudinary account configured.');
        }

        $timestamp = time();
        $publicId = $folder . '/' . uniqid();

        $params = [
            'public_id' => $publicId,
            'timestamp' => $timestamp,
            'folder' => $folder,
        ];
        
        ksort($params);
        $signatureString = http_build_query($params) . $this->account->api_secret;
        $signature = sha1($signatureString);

        $response = Http::post("https://api.cloudinary.com/v1_1/{$this->account->cloud_name}/auto/upload", [
            'file' => $url,
            'api_key' => $this->account->api_key,
            'timestamp' => $timestamp,
            'signature' => $signature,
            'public_id' => $publicId,
            'folder' => $folder,
        ]);

        if ($response->failed()) {
            throw new \Exception('Cloudinary upload failed: ' . $response->body());
        }

        return $response->json();
    }

    /**
     * Delete file from Cloudinary
     */
    public function delete(string $publicId): bool
    {
        if (!$this->account) {
            throw new \Exception('No active Cloudinary account configured.');
        }

        $timestamp = time();
        
        $params = [
            'public_id' => $publicId,
            'timestamp' => $timestamp,
        ];
        
        ksort($params);
        $signatureString = http_build_query($params) . $this->account->api_secret;
        $signature = sha1($signatureString);

        $response = Http::post("https://api.cloudinary.com/v1_1/{$this->account->cloud_name}/image/destroy", [
            'public_id' => $publicId,
            'api_key' => $this->account->api_key,
            'timestamp' => $timestamp,
            'signature' => $signature,
        ]);

        return $response->successful() && ($response->json()['result'] ?? '') === 'ok';
    }

    /**
     * Test connection to Cloudinary
     */
    public function testConnection(?string $cloudName = null, ?string $apiKey = null, ?string $apiSecret = null): array
    {
        $cloudName = $cloudName ?? $this->account?->cloud_name;
        $apiKey = $apiKey ?? $this->account?->api_key;
        $apiSecret = $apiSecret ?? $this->account?->api_secret;

        if (!$cloudName || !$apiKey || !$apiSecret) {
            return [
                'success' => false,
                'message' => 'Missing credentials',
            ];
        }

        try {
            $response = Http::withBasicAuth($apiKey, $apiSecret)
                ->get("https://api.cloudinary.com/v1_1/{$cloudName}/resources/image", [
                    'max_results' => 1,
                ]);

            if ($response->successful()) {
                return [
                    'success' => true,
                    'message' => 'Connection successful!',
                    'cloud_name' => $cloudName,
                ];
            }

            return [
                'success' => false,
                'message' => 'Connection failed: ' . ($response->json()['error']['message'] ?? 'Unknown error'),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Connection error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get Cloudinary URL for a public ID
     */
    public function getUrl(string $publicId, array $transformations = []): string
    {
        if (!$this->account) {
            return '';
        }

        $transformString = '';
        if (!empty($transformations)) {
            $transformString = implode(',', array_map(function ($key, $value) {
                return "{$key}_{$value}";
            }, array_keys($transformations), $transformations)) . '/';
        }

        return "https://res.cloudinary.com/{$this->account->cloud_name}/image/upload/{$transformString}{$publicId}";
    }
}
